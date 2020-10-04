from datetime import datetime
from uuid import uuid4
import json
from crypto.keygen import sign_hash, verify_sig, generate_key_pair
from blockchain.consensus import ProofOfWork
from Crypto.Hash import SHA256
import requests


class Transaction:
    def __init__(self, from_address, to_address, amount, node_id):
        self.check_arguments(from_address, to_address, amount, node_id)
        self.id = str(uuid4())
        self.node_id = node_id
        self.fromAddress = from_address
        self.toAddress = to_address
        self.amount = amount
        self.signature = sign_hash(self.calculate_hash(), node_id)

    def __repr__(self):
        return "Transaction " + self.id

    def check_arguments(self, from_address, to_address, amount, node_id):
        if not to_address:
            raise Exception("Transaction must have a destination address")

        if not node_id:
            raise Exception("Transaction must have an associated node id")

        if from_address and (not isinstance(from_address, str) or len(from_address) != 64):
            raise Exception("From address must be a string of length 64 chars")

        if not isinstance(to_address, str) or len(to_address) != 64:
            raise Exception("To address must be a string of length 64 chars")

        if not type(amount) is float:
            raise Exception("Transaction amount must be a float value")

        if amount < 0:
            raise Exception("Transaction amount must be greater or equal than 0")

    def calculate_hash(self):
        t_hash = SHA256.new()
        t_hash.update(self.transaction_content().encode())
        return t_hash

    def check_valid(self):
        if not self.signature or len(self.signature) == 0:
            print("No signature is this transaction!")
            return False

        try:
            verify_sig(self.calculate_hash(), self.signature, self.node_id)  # Throws error if signature is invalid

        except:
            print("Signature failed, integrity and/or signature value was not upheld")
            return False

        return True

    def transaction_content(self):
        return "{}{}{}{}{}".format(self.id, self.node_id, self.fromAddress, self.toAddress, self.amount)


class Block:

    def __init__(self, timestamp, transactions, index, previous_hash):
        self.check_arguments(timestamp, transactions, index, previous_hash)
        self.timestamp = timestamp
        self.transactions = transactions
        self.index = index
        self.previousHash = previous_hash
        self.currentHash = ""
        self.nonce = 0

    def __repr__(self):
        return self.timestamp + self.transactions + "Previous hash: " + self.previousHash + self.currentHash

    def check_arguments(self, timestamp, transactions, index, previous_hash):
        if not timestamp or not transactions or not previous_hash:
            raise Exception("Block must have a timestamp, one or more transactions and the previous block hash")

        if not isinstance(timestamp, type(datetime.now())):
            raise Exception("Timestamp must be a datetime")

        if index < 0 or not isinstance(index, int):
            raise Exception("Index must be a positive integer greater or equal to 0")

        if not self.has_valid_transactions(transactions):
            raise Exception("Invalid Transactions")

        if previous_hash == "0" and index != 0:
            raise Exception("Only genesis block can have an empty previous hash")

    def calculate_hash(self):
        b_hash = SHA256.new()
        b_hash.update(self.get_block_content().encode())
        return b_hash.hexdigest()

    def set_hash(self, hash_code):
        self.currentHash = hash_code

    # Proof-of-work
    def mine_block(self, difficulty):
        ProofOfWork(self, difficulty).mine_block()

    def get_block_content(self):
        return "{}{}{}{}{}".format(self.timestamp, self.transactions, self.index, self.previousHash, self.nonce)

    def print_self(self):
        print(self.timestamp)
        print(self.transactions)
        print("Previous hash: ", self.previousHash)
        print("Current hash: ", self.currentHash)
        print()

    def has_valid_transactions(self, transactions):

        trans: Transaction
        if isinstance(transactions, Transaction):  # If there is only one transaction
            return transactions.check_valid()

        else:
            for trans in transactions:
                if not trans.check_valid():
                    return False

            return True

    def serialize(self):
        return json.dumps(self, sort_keys=True).encode('utf-8')


class BlockchainInstance:
    def __init__(self, miner_address, node_identifier, host, port):
        self.check_arguments(miner_address, node_identifier, host, port)

        # Node Location
        self.address = '{}:{}'.format(host, port)

        # Node Discovery
        self.discovery_node_address = '0.0.0.0:5000'

        # Generate Public/Private key pair
        generate_key_pair(node_identifier)

        self.pending_transactions = []  # Due to proof-of-work phase
        self.peer_nodes = set()
        self.miner_address = miner_address  # Mined block rewards will always want to go to my own address
        self.node_identifier = node_identifier  # Node that owns this local blockchain
        self.chain = [self.calculate_gen_block()]

        # Constants
        self.difficulty = 2  # Determines how long it takes to calculate proof-of-work
        self.miningReward = 100.0  # Reward if a new block is successfully mined
        self.number_of_transactions = 3  # Number of transactions it waits to create a block

    def __repr__(self):
        return "class" + str(self.__class__)

    def check_arguments(self, miner_address, node_identifier, host, port):
        if not miner_address or not node_identifier or not host or not port:
            raise Exception("Blockchain must have the miner address, the node identifier a host and a port!")

        # Can miner address be anything other than a string?
        if not isinstance(miner_address, str):
            raise Exception("Miner address must be a String")

        if not isinstance(port, int) or port < 0:
            raise Exception("Port number must be a positive integer")

        # TODO - How to check if a host is valid? Can it be anything other than a string?

    def calculate_gen_block(self):
        gen_block = Block(datetime.now(), Transaction(None, self.miner_address, 0.0, self.node_identifier), 0, "0")
        gen_block.set_hash(gen_block.calculate_hash())
        return gen_block

    def get_latest_block(self):
        return self.chain[len(self.chain) - 1]

    def mine_pending_transactions(self):
        latest_block_index = self.get_latest_block().index + 1
        block_trans = self.pending_transactions.copy()
        block = Block(datetime.now(), block_trans,
                      latest_block_index, self.get_latest_block().currentHash)
        block.mine_block(self.difficulty)

        print("Block successfully mined: ", block.currentHash)
        self.chain.append(block)
        self.pending_transactions.clear()
        self.create_reward_transaction(self.miner_address, self.miningReward)

        #  add sanity checks
        return "Block mined"

    def create_reward_transaction(self, to_address, amount):
        self.pending_transactions.append(Transaction(None, to_address, amount, self.node_identifier))

        if len(self.pending_transactions) >= self.number_of_transactions:
            self.mine_pending_transactions()

    def create_transaction(self, from_address, to_address, amount):
        transaction = Transaction(from_address, to_address, amount, self.node_identifier)

        if not from_address:
            raise Exception("Transaction must have a from address!")

        self.pending_transactions.append(transaction)

        if len(self.pending_transactions) >= self.number_of_transactions:
            self.mine_pending_transactions()

        return transaction

    def get_balance(self, address):
        balance = 0
        for block in self.chain:
            if isinstance(block.transactions, Transaction):  # If there is only one transaction
                if address == block.transactions.toAddress:
                    balance += block.transactions.amount

                if address == block.transactions.fromAddress:
                    balance -= block.transactions.amount
            else:
                for transaction in block.transactions:
                    if address == transaction.toAddress:
                        balance += transaction.amount

                    if address == transaction.fromAddress:
                        balance -= transaction.amount

        return balance

    def is_chain_valid(self):
        for i in range(1, len(self.chain)):
            curr_block = self.chain[i]
            previous_block = self.chain[i - 1]

            if not curr_block.has_valid_transactions(curr_block.transactions):
                print("Current block", "(" + str(i) + ")", "has invalid transactions.")
                return False

            if curr_block.currentHash != curr_block.calculate_hash():
                print("Current hash of block", "(" + str(i) + ")", "is invalid.")
                return False

            elif curr_block.previousHash != previous_block.currentHash:
                print("Hash of previous block", "(" + str(i - 1) + ")", "is invalid.")
                return False

        return True

    def print_chain(self):
        for bl in self.chain:
            bl.print_self()

    def register_node(self, address):
        self.peer_nodes.add(address)

    def obtain_peer_node(self):
        if self.address != self.discovery_node_address:
            self.peer_nodes.add(self.discovery_node_address)    # Assuming it never crashes
            response = requests.post('http://{}/register/node'.format(self.discovery_node_address),
                                     json={'node_address': '{}'.format(self.address)}).json()

            for address in response['total_nodes']:
                # Add and register all peers
                try:
                    requests.post('http://{}/register/node'.format(address),
                                  json={'node_address': '{}'.format(self.address)})
                    self.register_node(address)
                except:
                    continue

            return self.peer_nodes

########################################################################################################################
