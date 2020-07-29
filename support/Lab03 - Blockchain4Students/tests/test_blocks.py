import unittest
from datetime import datetime
from blockchain.blockchain_data_structure import Block
from blockchain.blockchain_data_structure import Transaction
from crypto.keygen import generate_key_pair
from Crypto.Hash import SHA256

# --------------------------------------- #
# ----------- Variable Values ----------- #
# --------------------------------------- #

node_identifier = "test"
generate_key_pair(node_identifier)
from_hash = SHA256.new()
from_hash.update("from_address".encode())
from_address = from_hash.hexdigest()

to_hash = SHA256.new()
to_hash.update("to_address".encode())
to_address = to_hash.hexdigest()
amount = 1.0
difficulty = 2

# ------------------------------------------------ #
# ----------- Block Constructor Values ----------- #
# ------------------------------------------------ #
timestamp = datetime.now()
transaction = Transaction(from_address, to_address, amount, node_identifier)
b_hash = SHA256.new()
b_hash.update("test".encode())
previous_hash = b_hash.hexdigest()
index = 1
genesis_previous_hash = "0"

incorrect_transaction = Transaction(from_address, to_address, amount, node_identifier)
incorrect_transaction.amount = -1.0

vector_type_checks = [100, "string", 10.0]

class TestBlockClass(unittest.TestCase):

    # ------------------------------------- #
    # --------- Constructor Tests --------- #
    # ------------------------------------- #

    def test_constructor_correct(self):
        block = Block(timestamp, transaction, index, previous_hash)
        self.assertEqual(block.timestamp, timestamp)
        self.assertEqual(block.transactions, transaction)
        self.assertEqual(block.index, index)
        self.assertEqual(block.previousHash, previous_hash)

    def test_constructor_correct_genesis_block(self):
        block = Block(timestamp, transaction, 0, genesis_previous_hash)
        self.assertEqual(block.timestamp, timestamp)
        self.assertEqual(block.transactions, transaction)
        self.assertEqual(block.index, 0)
        self.assertEqual(block.previousHash, genesis_previous_hash)

    def test_constructor_null_timestamp(self):
        with self.assertRaises(Exception):
            Block(None, transaction, index, previous_hash)

    def test_constructor_incorrect_timestamp(self):
        for argument in vector_type_checks:
            with self.assertRaises(Exception):
                Block(argument, transaction, index, previous_hash)

    def test_constructor_null_transaction(self):
        with self.assertRaises(Exception):
            Block(timestamp, None, index, previous_hash)

    def test_constructor_incorrect_argument_transaction(self):
        for argument in vector_type_checks:
            with self.assertRaises(Exception):
                Block(timestamp, argument, index, previous_hash)

    def test_constructor_null_transaction_list(self):
        with self.assertRaises(Exception):
            Block(timestamp, [None], index, previous_hash)

    def test_constructor_transaction_list_with_null(self):
        with self.assertRaises(Exception):
            Block(timestamp, [transaction, None], index, previous_hash)

    def test_constructor_incorrect_transaction(self):
        with self.assertRaises(Exception):
            Block(timestamp, incorrect_transaction, index, previous_hash)

    def test_constructor_null_previous_hash(self):
        with self.assertRaises(Exception):
            Block(timestamp, transaction, index, None)

    def test_constructor_not_genesis_previous_hash(self):
        with self.assertRaises(Exception):
            Block(timestamp, transaction, index, genesis_previous_hash)
    # --------------------------------------- #
    # ------------- Mining Tests ------------ #
    # --------------------------------------- #

    def test_mining_correct_difficulty(self):
        block = Block(timestamp, transaction, index, previous_hash)
        block.mine_block(difficulty)
        self.assertEqual(block.currentHash[0:difficulty], "".join((["0"] * difficulty)))

    # --------------------------------------- #
    # ------- Transaction Check Tests ------- #
    # --------------------------------------- #

    def test_transaction_check_correct_single(self):
        block = Block(timestamp, transaction, index, previous_hash)
        self.assertTrue(block.has_valid_transactions(block.transactions))

    def test_transaction_check_correct_list(self):
        block = Block(timestamp, [transaction, transaction], index, previous_hash)
        self.assertTrue(block.has_valid_transactions(block.transactions))

    def test_transaction_check_invalid_transaction(self):
        block = Block(timestamp, transaction, index, previous_hash)
        block.transactions = incorrect_transaction
        self.assertFalse(block.has_valid_transactions(block.transactions))

    def test_transaction_check_invalid_transaction_list(self):
        block = Block(timestamp, transaction,  index, previous_hash)
        block.transactions = [transaction, incorrect_transaction]
        self.assertFalse(block.has_valid_transactions(block.transactions))

    # --------------------------------------- #
    # ----------- Integrity Tests ----------- #
    # --------------------------------------- #

    def test_integrity_modified_timestamp(self):
        block = Block(timestamp, transaction, index, previous_hash)
        block.mine_block(2)
        block.timestamp = datetime.now()
        self.assertNotEqual(block.currentHash, block.calculate_hash())

    def test_integrity_modified_transaction_null(self):
        block = Block(timestamp, Transaction(from_address, to_address, amount, node_identifier), index, previous_hash)
        block.mine_block(2)
        block.transactions = None
        self.assertNotEqual(block.currentHash, block.calculate_hash())

    def test_integrity_modified_transaction_list(self):
        block = Block(timestamp, [transaction, Transaction(from_address, to_address, amount, node_identifier)], index, previous_hash)
        block.mine_block(2)
        block.transactions[1] = None
        self.assertNotEqual(block.currentHash, block.calculate_hash())

    def test_integrity_modified_transaction_list_null(self):
        block = Block(timestamp, [transaction, Transaction(from_address, to_address, amount, node_identifier)], index, previous_hash)
        block.mine_block(2)
        block.transactions = None
        self.assertNotEqual(block.currentHash, block.calculate_hash())

    def test_integrity_modified_index(self):
        block = Block(timestamp, transaction, index, previous_hash)
        block.mine_block(2)
        block.index = -1
        self.assertNotEqual(block.currentHash, block.calculate_hash())

    def test_integrity_modified_previous_hash(self):
        block = Block(timestamp, transaction, index, previous_hash)
        block.mine_block(2)
        block.previousHash = "wrongHash"
        self.assertNotEqual(block.currentHash, block.calculate_hash())

    def test_integrity_modified_nonce(self):
        block = Block(timestamp, transaction, index, previous_hash)
        block.mine_block(2)
        block.nonce = -1    # Pray it doesnt it the correct nonce...
        self.assertNotEqual(block.currentHash, block.calculate_hash())


if __name__ == '__main__':
    unittest.main()