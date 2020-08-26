#!/bin/bash
#
# SPDX-License-Identifier: Apache-2.0

function _exit(){
    printf "Exiting:%s\n" "$1"
    exit -1
}

# Exit on first error, print all commands.
set -ev
set -o pipefail

# Where am I?
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
export FABRIC_CFG_PATH="${DIR}/../config"

cd "${DIR}/../test-network/"


#Cleanup previous deployments
./network.sh down

#Instantiate network
./network.sh up createChannel -ca -s couchdb


# Copy the connection profiles so they are in the correct organizations. 
cp "${DIR}/../test-network/organizations/peerOrganizations/org1.example.com/connection-org1.yaml" "${DIR}/organization/students-union/gateway/"
cp "${DIR}/../test-network/organizations/peerOrganizations/org2.example.com/connection-org2.yaml" "${DIR}/organization/university/gateway/"

echo Suggest that you monitor the docker containers by running
echo "./organization/university/configuration/cli/monitordocker.sh net_test"

#Deploy chaincode
./network.sh deployCC -l javascript