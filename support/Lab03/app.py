from argparse import ArgumentParser
from uuid import uuid4
from datetime import datetime
from flask import Flask
from flask import request
from Crypto.Hash import SHA256
from blockchain.blockchain_data_structure import BlockchainInstance
from crypto.keygen import generate_key_pair
import json
import jsonpickle
import os
from os.path import join, dirname
from dotenv import load_dotenv
import sys
import logging
from logging import StreamHandler

# Create .env file path.
dotenv_path = join(dirname(__file__), '.env')

# Load env vars
load_dotenv(dotenv_path)

# Instantiate our Node
app = Flask(__name__)

# keep stdout/stderr logging using StreamHandler
streamHandler = StreamHandler()
app.logger.addHandler(streamHandler)

# define log level to DEBUG
app.logger.setLevel(logging.INFO)

app.logger.debug("Environment variables:")
for k, v in os.environ.items():
    app.logger.debug(f'{k}={v}')

# Generate a globally unique address for this node
node_identifier = str(uuid4()).replace('-', '')

# Obtain public/private key_pair for this node
generate_key_pair(node_identifier)

@app.route('/', methods=['GET'])
def get_chain():
    response = {
        'chain': jsonpickle.encode(blockchain.chain),   # We may want to create a JSON encoder for "prettier" results
        'blockIndex': len(blockchain.chain),
        'metadata': blockchain.miningReward
    }
    return json.dumps(response), 200

@app.route('/transactions/new', methods=['POST'])
def new_transaction():
    tx_data = request.get_json()
    tx_data["timestamp"] = datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
    try:
        check_transaction_arguments(tx_data["from_address"], tx_data["to_address"], tx_data["amount"])
    except Exception as e:
        json_arguments = ["from_address", "to_address", "amount"]
        for argument in json_arguments:
            if argument not in tx_data:
                return "Transaction must have a " + argument

        return str(e), 200

    blockchain.create_transaction(tx_data["from_address"], tx_data["to_address"], tx_data["amount"])
    return "Success", 200


@app.route('/transactions/pending', methods=['GET'])
def get_pending_transactions():
    return jsonpickle.encode(blockchain.pending_transactions), 200


@app.route('/getPeers', methods=['GET'])
def get_peers():
    app.logger.info("Getting peers")
    return jsonpickle.encode(blockchain.obtain_peer_node(), 200)


@app.route('/register/node', methods=['POST'])
def register_peer_node():
    node_address = request.get_json()["node_address"]

    response = {
        'message': 'Node added',
        'total_nodes': list(blockchain.peer_nodes),
    }
    blockchain.register_node(node_address)
    return json.dumps(response), 200


@app.route('/peers', methods=['GET'])
def get_known_peers():
    return json.dumps(list(blockchain.peer_nodes)), 200

# Do we still need these functions?
#TODO
#@app.route('/register_with', methods=['POST'])
#def register_with_existing_node():

#TODO
#@app.route('/add_block', methods=['POST'])
#def add_and_announce_block():

def check_transaction_arguments(from_address, to_address, amount):
    if not to_address or not from_address:
        raise Exception("Transaction must have a from and to destination address")

    if not isinstance(from_address, str) or len(from_address) != 64:
        raise Exception("From address must be a string of length 64 chars")

    if not isinstance(to_address, str) or len(to_address) != 64:
        raise Exception("To address must be a string of length 64 chars")

    if not type(amount) is float:
        raise Exception("Transaction amount must be a float value")

    if amount < 0:
        raise Exception("Transaction amount must be greater or equal than 0")




if __name__ == '__main__':
    parser = ArgumentParser(description='Parametrize the blockchain instance.')
    parser.add_argument('-p', '--port', default=5000, type=int, help='port to listen on')
    parser.add_argument('-ho', '--host', default='0.0.0.0', type=str, help='server host')
    parser.add_argument('-a', '--address', default='default_address', type=str, help='miner address')
    args = parser.parse_args()
    app.logger.info("Arguments:")
    app.logger.info(args)
    port = args.port
    host = args.host
    default_address = args.address

    hash_function = SHA256.new()
    hash_function.update(default_address.encode())
    miner_address = hash_function.hexdigest()
    blockchain = BlockchainInstance(miner_address, node_identifier, host, port)
    app.run(host=host, port=port)
