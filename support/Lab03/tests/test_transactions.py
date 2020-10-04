import unittest
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

vector_address_type_test = [100, 100.0]
wrong_address_size = "size"


class TestTransactionClass(unittest.TestCase):

    # ------------------------------------- #
    # --------- Constructor Tests --------- #
    # ------------------------------------- #

    def test_constructor_correct(self):
        transaction = Transaction(from_address, to_address, amount, node_identifier)
        self.assertEqual(transaction.fromAddress, from_address)
        self.assertEqual(transaction.toAddress, to_address)
        self.assertEqual(transaction.amount, amount)
        self.assertEqual(transaction.node_id, node_identifier)

    def test_constructor_correct_null_from_address(self):
        transaction = Transaction(None, to_address, amount, node_identifier)
        self.assertEqual(transaction.toAddress, to_address)
        self.assertEqual(transaction.amount, amount)
        self.assertEqual(transaction.node_id, node_identifier)

    def test_constructor_null_to_address(self):
        with self.assertRaises(Exception):
            Transaction(from_address, None, amount, node_identifier)

    def test_constructor_negative_amount(self):
        with self.assertRaises(Exception):
            Transaction(from_address, to_address, -1.0, node_identifier)

    def test_constructor_non_float_amount(self):
        with self.assertRaises(Exception):
            Transaction(from_address, to_address, 2, node_identifier)

    def test_constructor_none_amount(self):
        with self.assertRaises(Exception):
            Transaction(from_address, to_address, None, node_identifier)

    def test_constructor_none_node_id(self):
        with self.assertRaises(Exception):
            Transaction(from_address, to_address, amount, None)

    def test_constructor_wrong_from_address_type(self):
        for wrong_from_address in vector_address_type_test:
            with self.assertRaises(Exception):
                Transaction(wrong_from_address, to_address, amount, node_identifier)

    def test_constructor_wrong_from_address_size(self):
        with self.assertRaises(Exception):
            Transaction(wrong_address_size, to_address, amount, node_identifier)

    def test_constructor_wrong_to_address_size(self):
        with self.assertRaises(Exception):
            Transaction(from_address, wrong_address_size, amount, node_identifier)

    def test_constructor_wrong_to_address_type(self):
        for wrong_to_address in vector_address_type_test:
            with self.assertRaises(Exception):
                Transaction(from_address, wrong_to_address, amount, node_identifier)

    # --------------------------------------- #
    # ----------- Integrity Tests ----------- #
    # --------------------------------------- #

    def test_integrity_modified_id(self):
        transaction = Transaction(from_address, to_address, amount, node_identifier)
        transaction.id = "fake_id"
        self.assertFalse(transaction.check_valid())

    def test_integrity_modified_from_address(self):
        transaction = Transaction(from_address, to_address, amount, node_identifier)
        transaction.fromAddress = "fake_from_address"
        self.assertFalse(transaction.check_valid())

    def test_integrity_modified_to_address(self):
        transaction = Transaction(from_address, to_address, amount, node_identifier)
        transaction.toAddress = "fake_to_address"
        self.assertFalse(transaction.check_valid())

    def test_integrity_modified_amount(self):
        transaction = Transaction(from_address, to_address, amount, node_identifier)
        transaction.amount = 2
        self.assertFalse(transaction.check_valid())

    def test_integrity_modified_node_id(self):
        transaction = Transaction(from_address, to_address, amount, node_identifier)
        transaction.node_id = "test2"
        self.assertFalse(transaction.check_valid())

    def test_integrity_modified_signature(self):
        transaction = Transaction(from_address, to_address, amount, node_identifier)
        transaction.signature = bytes('test', encoding='utf-8')
        self.assertFalse(transaction.check_valid())


if __name__ == '__main__':
    unittest.main()
