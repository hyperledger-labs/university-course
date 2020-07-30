# Blockchain4Students (B4S)

Blockchain4Students (B4S) is a simple blockchain with focus on understandability, tailored to teach blockchain technology.
## Requirements:
Python 3.8.3
Docker version 19 (tested with version 19.03.8, build afacb8b7f0)

This project has been tested with Ubuntu 20.04
## Running Blockchain4Students (B4S)

### Via Docker
Run `./setup-docker`. This creates a blockchain with one node, runnning on default port 5000, mapped to the local machine port 8001.
You can access the node's endpoints by opening a browser at: `http://0.0.0.0:8001`. For example, to get the peers, go to `http://0.0.0.0:8001/getPeers`

To run more nodes, run 
docker run --name NAME -p "LOCAL_HOST:DOCKER_HOST" -e node_port=DOCKER_HOST -e miner_address=MINER_ADDRESS -e host=HOST_ADDRESS blockchain4students/blockchain-node:0.1
, replacing the variables. Examples:
 
`docker run --name "blockchain-node-2" -p "5001:5001" -e node_port=5001 -e miner_address="default_address-1" -e host="0.0.0.0" blockchain4students/blockchain-node:0.1`

`docker run --name "blockchain-node-3" -p "5002:5002" -e node_port=5002 -e miner_address="default_address-2" -e host="0.0.0.0" blockchain4students/blockchain-node:0.1`

If you want to add a host, add the option `-e host="HOST_NAME"`.

To debug the containers, run `docker ps -a` to list your containers. 
Copy the ID of your container and run `docker logs CONTAINER_ID`
### Via Venv
First, define env variables: duplicate the file .env-example, and rename it to .env. Change the variables value accordingly

Run `./setup-venv`

You are now in a virtual env
After the initial setup, you can run ```python3 node.py``` to run the default node.

To run other nodes: `python3 app.py -p ${node_port} -a ${miner_address} -ho ${host}`
## Teardown
To delete B4S-related containers, as well as generated private keys, run `./cleanup.sh`

##Original Repository and Authors
 The original repository can be found [at Blockchain4Students](https://github.com/BlockChain4Students/blockchain_node)
 
 Original authors:
 * Catarina Pedreira
 * Rafael Soares
 * Rafael Belchior