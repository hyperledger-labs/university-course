# B4S QUC
The B4S QUC system implements a \emph{Transparent Curricular Unit Quality System} (T-QUC), based on the \emph{QUC} system introduced in the last lab.

The students can provide feedback about courses they attended, and their teaching staff. In exchange for providing feedback, students may be awarded a proof of given feedback (PoF), which universities can later reward (for example, reducing tuition, discounts in the school canteen, etc). Professors can provide feedback on the courses they have given, as well as considerations on the QUC scores they have received on a specific course. Professors can be awarded PoF, as well as recognition awards for teaching excellence, in case their QUCs are 9. We consider all awards to be information stored in the blockchain.


In order to know which students and professors can answer to QUCs of which courses, the university emits codes that identifies them, as well as the courses they can answer. When a student or professor want to participate on the QUCs, they are requeste that via the students union or professors department. The QUC scores are calculated by the chaincode, and made public, for transparency of the educational ecosystem.

For more information, refer to the laboratory guide.

## Prerequisites
Node v12.18, npm v6.14 (previously tested with Node v10.19.0 )
https://nodejs.org/en/

Git, Curl

Docker and Docker Compose https://www.docker.com/

Images and binaries, run ``curl -sSL https://raw.githubusercontent.com/hyperledger/fabric/master/scripts/bootstrap.sh | bash -s -- 2.2.0 1.4.8
``. Copy the contents of fabric/samples/bin to JusticeChain_Fabric/bin, in case there is a newer version.

[Check this link for more info](https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html)


## Structure

### bin
Contains necessary binaries for Fabric

### chaincode
Contains the smart contracts to be deployed to the blockchain

### config
Contains necessary configuration files for Fabric

### b4s-quc
Contains scripts to start B4S QUC. The organization folder is further divided into universities and students-union.

### test-network
A Fabric 2.2 network, in which B4S QUC is installed.

## Running B4S
First, install the prerequesites.
Second, clean the environment:
1. Run ``docker rm -f $(docker ps -aq)``
1. Run ``docker rmi -f $(docker images | grep hyperledger | awk '{print $3}')``
1. Run ``docker rmi -f $(docker images | grep dev | awk '{print $3}')``
1. Run ``docker volume prune``
1. Run ``docker network prune``

Go to the b4s folder: ``cd b4s``, and run: ``./network-start``.
This script creates the network (peers, orderer), their respective cryptographic material, and enrolls several users on the network.universities the studentUnionPresident from student's union, and a university universityTecnicoLisboa. A network Admin from the studentsUnion and from the university is also created.


## Interact with the blockchain
At the university organization, run: ``source university.sh``

QUC smart contract:
For the start function:
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls true --cafile /home/rafael/Projects/university-course/support/Lab05/test-network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n b4s --peerAddresses localhost:7051 --tlsRootCertFiles /home/rafael/Projects/university-course/support/Lab05/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles /home/rafael/Projects/university-course/support/Lab05/test-network/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{"function":"org.b4s.quc:start", "Args":[]}' --waitForEvent

For the showIdentity function:
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls true --cafile /home/rafael/Projects/university-course/support/Lab05/test-network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n b4s --peerAddresses localhost:7051 --tlsRootCertFiles /home/rafael/Projects/university-course/support/Lab05/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles /home/rafael/Projects/university-course/support/Lab05/test-network/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{"function":"org.b4s.quc:showIdentity", "Args":[]}' --waitForEvent

For the createUniversity function:
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls true --cafile /home/rafael/Projects/university-course/support/Lab05/test-network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n b4s --peerAddresses localhost:7051 --tlsRootCertFiles /home/rafael/Projects/university-course/support/Lab05/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles /home/rafael/Projects/university-course/support/Lab05/test-network/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{"function":"org.b4s.logistics:createUniversity", "Args":["tecnicoLisboa", "Portugal"]}' --waitForEvent


## Stop B4S
To stop justicechain, run: ``docker stop $(docker ps -a -q)``. If you wish to restart it, run: ``docker start $(docker ps -a -q)``.

##Remove B4S
Go to the b4s folder.
To remove b4s, run: ``./network-clean``.
