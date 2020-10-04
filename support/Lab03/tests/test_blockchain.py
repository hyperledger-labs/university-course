import sys
import unittest
sys.path.append('../blockchain')
from blockchain.blockchain_data_structure import BlockchainInstance, Transaction

sys.path.append('../crypto')
from crypto.keygen import generate_key_pair
from Crypto.Hash import SHA256

# --------------------------------------- #
# ----------- Variable Values ----------- #
# --------------------------------------- #
hash_function = SHA256.new()
hash_function.update("catarina-address".encode())
miner_address = hash_function.hexdigest()
node_identifier = "test"
generate_key_pair(node_identifier)
host = '0.0.0.0'
port = 5002
blockchain_address = '{}:{}'.format(host, port)

from_hash = SHA256.new()
from_hash.update("from_address".encode())
from_address = from_hash.hexdigest()

to_hash = SHA256.new()
to_hash.update("to_address".encode())
to_address = to_hash.hexdigest()
amount = 1.0
peer_node = "localhost:5100"


class TestBlockchainClass(unittest.TestCase):


    # ------------------------------------- #
    # --------- Constructor Tests --------- #
    # ------------------------------------- #

    def test_constructor_correct(self):
        blockchain = BlockchainInstance(miner_address, node_identifier, host, port)
        self.assertEqual(blockchain.miner_address, miner_address)
        self.assertEqual(blockchain.node_identifier, node_identifier)
        self.assertEqual(blockchain.address, blockchain_address)

    def test_constructor_null_miner_address(self):
        with self.assertRaises(Exception):
            BlockchainInstance(None, node_identifier, host, port)

    def test_constructor_null_node_identifier(self):
        with self.assertRaises(Exception):
            BlockchainInstance(miner_address, None, host, port)

    def test_constructor_null_host(self):
        with self.assertRaises(Exception):
            BlockchainInstance(miner_address, node_identifier, None, port)

    def test_constructor_null_port(self):
        with self.assertRaises(Exception):
            BlockchainInstance(miner_address, node_identifier, host, None)

    # ------------------------------------- #
    # ---------- Gen Block Tests ---------- #
    # ------------------------------------- #

    def test_gen_block_correct(self):
        gen_block = BlockchainInstance(miner_address, node_identifier, host, port).calculate_gen_block()
        self.assertEqual(gen_block.index, 0)
        self.assertEqual(gen_block.previousHash, "0")
        transaction = gen_block.transactions
        self.assertTrue(isinstance(transaction, Transaction))
        self.assertEqual(transaction.amount, 0.0)
        self.assertEqual(transaction.fromAddress, None)
        self.assertEqual(transaction.toAddress, miner_address)
        self.assertEqual(transaction.node_id, node_identifier)

    # ------------------------------------- #
    # ----- Create Transaction Tests ------ #
    # ------------------------------------- #

    def test_create_transaction(self):
        blockchain = BlockchainInstance(miner_address, node_identifier, host, port)
        transaction = blockchain.create_transaction(from_address, to_address, amount)
        self.assertEqual(transaction.fromAddress, from_address)
        self.assertEqual(transaction.toAddress, to_address)
        self.assertEqual(transaction.amount, amount)
        self.assertEqual(len(blockchain.pending_transactions), 1)
        self.assertEqual(blockchain.pending_transactions[0], transaction)

    def test_create_transaction_no_from_address(self):
        with self.assertRaises(Exception):
            BlockchainInstance(miner_address, node_identifier, host, port)\
                .create_transaction(None, to_address, amount)

    def test_create_transaction_no_to_address(self):
        with self.assertRaises(Exception):
            BlockchainInstance(miner_address, node_identifier, host, port)\
                .create_transaction(from_address, None, amount)

    def test_create_transaction_no_amount(self):
        with self.assertRaises(Exception):
            BlockchainInstance(miner_address, node_identifier, host, port)\
                .create_transaction(from_address, to_address, None)

    # ------------------------------------- #
    # ------- Block Creation Tests -------- #
    # ------------------------------------- #

    def test_block_creation_(self):
        blockchain = BlockchainInstance(miner_address, node_identifier, host, port)
        transaction_list = []
        for transactions in range(blockchain.number_of_transactions):
            transaction_list.append(blockchain.create_transaction(from_address, to_address, amount))

        self.assertEqual(len(blockchain.chain), 2)
        new_block = blockchain.chain[1]
        previous_block = blockchain.chain[0]
        self.assertEqual(new_block.index, previous_block.index+1)
        self.assertEqual(new_block.previousHash, previous_block.currentHash)
        self.assertEqual(new_block.transactions, transaction_list)

    def test_block_creation_reward_transaction(self):
        blockchain = BlockchainInstance(miner_address, node_identifier, host, port)

        for transactions in range(blockchain.number_of_transactions):
            blockchain.create_transaction(from_address, to_address, amount)

        self.assertEqual(len(blockchain.pending_transactions), 1)
        transaction = blockchain.pending_transactions[0]
        self.assertEqual(transaction.toAddress, blockchain.miner_address)
        self.assertEqual(transaction.fromAddress, None)
        self.assertEqual(transaction.amount, blockchain.miningReward)

    # ------------------------------------- #
    # ----------- Balance Tests ----------- #
    # ------------------------------------- #

    def test_address_balance(self):
        blockchain = BlockchainInstance(miner_address, node_identifier, host, port)

        for transactions in range(blockchain.number_of_transactions):
            blockchain.create_transaction(from_address, to_address, amount)

        self.assertEqual(blockchain.get_balance(from_address), -(amount * blockchain.number_of_transactions))
        self.assertEqual(blockchain.get_balance(to_address), amount * blockchain.number_of_transactions)

    def test_address_balance_miner_address(self):
        blockchain = BlockchainInstance(miner_address, node_identifier, host, port)

        for transactions in range(blockchain.number_of_transactions * 2):
            blockchain.create_transaction(from_address, to_address, amount)

        self.assertEqual(blockchain.get_balance(from_address), -(amount * blockchain.number_of_transactions * 2 - 1))
        self.assertEqual(blockchain.get_balance(to_address), amount * blockchain.number_of_transactions * 2 - 1)
        self.assertEqual(blockchain.get_balance(miner_address), blockchain.miningReward)

    # ------------------------------------- #
    # ------- Chain Validity Tests -------- #
    # ------------------------------------- #

    def test_chain_validity_correct(self):
        blockchain = BlockchainInstance(miner_address, node_identifier, host, port)

        for transactions in range(blockchain.number_of_transactions * 2):
            blockchain.create_transaction(from_address, to_address, amount)

        self.assertTrue(blockchain.is_chain_valid())

    def test_chain_validity_invalid_transaction(self):
        blockchain = BlockchainInstance(miner_address, node_identifier, host, port)

        for transactions in range(blockchain.number_of_transactions * 2):
            blockchain.create_transaction(from_address, to_address, amount)

        blockchain.get_latest_block().transactions[0].amount = -1
        self.assertFalse(blockchain.is_chain_valid())

    def test_chain_validity_invalid_block(self):
        blockchain = BlockchainInstance(miner_address, node_identifier, host, port)

        for transactions in range(blockchain.number_of_transactions * 2):
            blockchain.create_transaction(from_address, to_address, amount)

        blockchain.get_latest_block().index = -1
        self.assertFalse(blockchain.is_chain_valid())

    # ------------------------------------- #
    # --------- Peer Nodes Tests ---------- #
    # ------------------------------------- #

    def test_peer_node_register(self):
        blockchain = BlockchainInstance(miner_address, node_identifier, host, port)

        blockchain.register_node(peer_node)
        self.assertEqual(len(blockchain.peer_nodes), 1)
        self.assertEqual(blockchain.peer_nodes.pop(), peer_node)

    # TODO - Mock requests.post method to test obtain_peer_node method
    # def test_peer_not_obtain(self):

if __name__ == '__main__':
    unittest.main()