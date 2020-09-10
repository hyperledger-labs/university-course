#!/usr/bin/env bash

CHANNEL_NAME="$1"
CC_RUNTIME_LANGUAGE="$2"
VERSION="$3"
DELAY="$4"
MAX_RETRY="$5"
VERBOSE="$6"
: ${CHANNEL_NAME:="mychannel"}
: ${CC_RUNTIME_LANGUAGE:="javascript"}
: ${VERSION:="1"}
: ${DELAY:="3"}
: ${MAX_RETRY:="5"}
: ${VERBOSE:="false"}
CC_RUNTIME_LANGUAGE=`echo "$CC_RUNTIME_LANGUAGE" | tr [:upper:] [:lower:]`

FABRIC_CFG_PATH=$PWD/../config/

if [ "$CC_RUNTIME_LANGUAGE" = "go" -o "$CC_RUNTIME_LANGUAGE" = "golang" ] ; then
	CC_RUNTIME_LANGUAGE=golang
	CC_SRC_PATH="../chaincode/fabcar/go/"

	echo Vendoring Go dependencies ...
	pushd ../chaincode/fabcar/go
	GO111MODULE=on go mod vendor
	popd
	echo Finished vendoring Go dependencies

elif [ "$CC_RUNTIME_LANGUAGE" = "javascript" ]; then
	CC_RUNTIME_LANGUAGE=node # chaincode runtime language is node.js
	CC_SRC_PATH="../chaincode"

elif [ "$CC_RUNTIME_LANGUAGE" = "java" ]; then
	CC_RUNTIME_LANGUAGE=java
	CC_SRC_PATH="../chaincode/fabcar/java/build/install/fabcar"

	echo Compiling Java code ...
	pushd ../chaincode/fabcar/java
	./gradlew installDist
	popd
	echo Finished compiling Java code

else
	echo The chaincode language ${CC_RUNTIME_LANGUAGE} is not supported by this script
	echo Supported chaincode languages are: go, javascript, java
	exit 1
fi

# import utils
. scripts/envVar.sh


packageChaincode() {
  ORG=$1
  setGlobals $ORG
  set -x
  peer lifecycle chaincode package b4s.tar.gz --path ${CC_SRC_PATH} --lang ${CC_RUNTIME_LANGUAGE} --label b4s_${VERSION} >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Chaincode packaging on peer0.org${ORG} has failed"
  echo "===================== Chaincode is packaged on peer0.org${ORG} ===================== "
  echo
}

# installChaincode PEER ORG
installChaincode() {
  ORG=$1
  setGlobals $ORG
  set -x
  peer lifecycle chaincode install b4s.tar.gz >&log.txt
  res=$?
  set +x
  cat log.txt
  #echo "===================================="
  #echo "chaincode install returned $res"
  #echo "sleeping for 5 minutes..."
  #sleep 300
  verifyResult $res "Chaincode installation on peer0.org${ORG} has failed"
  echo "===================== Chaincode is installed on peer0.org${ORG} ===================== "
  echo
}

# queryInstalled PEER ORG
queryInstalled() {
  ORG=$1
  setGlobals $ORG
  set -x
  peer lifecycle chaincode queryinstalled >&log.txt
  res=$?
  set +x
  cat log.txt
	PACKAGE_ID=$(sed -n "/${VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
  verifyResult $res "Query installed on peer0.org${ORG} has failed"
  echo PackageID is ${PACKAGE_ID}
  echo "===================== Query installed successful on peer0.org${ORG} on channel ===================== "
  echo
}

# approveForMyOrg VERSION PEER ORG
approveForMyOrg() {
  ORG=$1
  setGlobals $ORG

  if [ -z "$CORE_PEER_TLS_ENABLED" -o "$CORE_PEER_TLS_ENABLED" = "false" ] ; then
    set -x
    peer lifecycle chaincode approveformyorg -o localhost:7050 --channelID $CHANNEL_NAME --name b4s --version ${VERSION} --init-required --package-id ${PACKAGE_ID} --sequence ${VERSION} --waitForEvent >&log.txt
    set +x
  else
    set -x
    peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name b4s --version ${VERSION} --init-required --package-id ${PACKAGE_ID} --sequence ${VERSION} >&log.txt
    set +x
  fi
  cat log.txt
  verifyResult $res "Chaincode definition approved on peer0.org${ORG} on channel '$CHANNEL_NAME' failed"
  echo "===================== Chaincode definition approved on peer0.org${ORG} on channel '$CHANNEL_NAME' ===================== "
  echo
}

# checkCommitReadiness VERSION PEER ORG
checkCommitReadiness() {
  ORG=$1
  shift 1
  setGlobals $ORG
  echo "===================== Checking the commit readiness of the chaincode definition on peer0.org${ORG} on channel '$CHANNEL_NAME'... ===================== "
	local rc=1
	local COUNTER=1
	# continue to poll
  # we either get a successful response, or reach MAX RETRY
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
    sleep $DELAY
    echo "Attempting to check the commit readiness of the chaincode definition on peer0.org${ORG} secs"
    set -x
    peer lifecycle chaincode checkcommitreadiness --channelID $CHANNEL_NAME --name b4s $PEER_CONN_PARMS --version ${VERSION} --sequence ${VERSION} --output json --init-required >&log.txt
    res=$?
    set +x
		#test $res -eq 0 || continue
    let rc=0
    for var in "$@"
    do
      grep "$var" log.txt &>/dev/null || let rc=1
    done
		COUNTER=$(expr $COUNTER + 1)
	done
  cat log.txt
  if test $rc -eq 0; then
    echo "===================== Checking the commit readiness of the chaincode definition successful on peer0.org${ORG} on channel '$CHANNEL_NAME' ===================== "
  else
    echo "!!!!!!!!!!!!!!! After $MAX_RETRY attempts, Check commit readiness result on peer0.org${ORG} is INVALID !!!!!!!!!!!!!!!!"
    echo "================== ERROR !!! FAILED to execute End-2-End Scenario =================="
    echo
    exit 1
  fi
}

# commitChaincodeDefinition VERSION PEER ORG (PEER ORG)...
commitChaincodeDefinition() {
  parsePeerConnectionParameters $@
  res=$?
  verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "

  # while 'peer chaincode' command can get the orderer endpoint from the
  # peer (if join was successful), let's supply it directly as we know
  # it using the "-o" option
  if [ -z "$CORE_PEER_TLS_ENABLED" -o "$CORE_PEER_TLS_ENABLED" = "false" ] ; then
    set -x
    peer lifecycle chaincode commit -o localhost:7050 --channelID $CHANNEL_NAME --name b4s $PEER_CONN_PARMS --version ${VERSION} --sequence ${VERSION} --init-required >&log.txt
    res=$?
    set +x
  else
    set -x
    peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name b4s $PEER_CONN_PARMS --version ${VERSION} --sequence ${VERSION} --init-required >&log.txt
    res=$?
    set +x
  fi
  cat log.txt
  verifyResult $res "Chaincode definition commit failed on peer0.org${ORG} on channel '$CHANNEL_NAME' failed"
  echo "===================== Chaincode definition committed on channel '$CHANNEL_NAME' ===================== "
  echo
}

# queryCommitted ORG
queryCommitted() {
  ORG=$1
  setGlobals $ORG
  EXPECTED_RESULT="Version: ${VERSION}, Sequence: ${VERSION}, Endorsement Plugin: escc, Validation Plugin: vscc"
  echo "===================== Querying chaincode definition on peer0.org${ORG} on channel '$CHANNEL_NAME'... ===================== "
	local rc=1
	local COUNTER=1
	# continue to poll
  # we either get a successful response, or reach MAX RETRY
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
    sleep $DELAY
    echo "Attempting to Query committed status on peer0.org${ORG}, Retry after $DELAY seconds."
    set -x
    peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name b4s >&log.txt
    res=$?
    set +x
		test $res -eq 0 && VALUE=$(cat log.txt | grep -o '^Version: [0-9], Sequence: [0-9], Endorsement Plugin: escc, Validation Plugin: vscc')
    test "$VALUE" = "$EXPECTED_RESULT" && let rc=0
		COUNTER=$(expr $COUNTER + 1)
	done
  echo
  cat log.txt
  if test $rc -eq 0; then
    echo "===================== Query chaincode definition successful on peer0.org${ORG} on channel '$CHANNEL_NAME' ===================== "
		echo
  else
    echo "!!!!!!!!!!!!!!! After $MAX_RETRY attempts, Query chaincode definition result on peer0.org${ORG} is INVALID !!!!!!!!!!!!!!!!"
    echo
    exit 1
  fi
}

chaincodeInvokeInit() {
  parsePeerConnectionParameters $@
  res=$?
  verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "

  # while 'peer chaincode' command can get the orderer endpoint from the
  # peer (if join was successful), let's supply it directly as we know
  # it using the "-o" option
  if [ -z "$CORE_PEER_TLS_ENABLED" -o "$CORE_PEER_TLS_ENABLED" = "false" ]; then
    set -x
    peer chaincode invoke -o localhost:7050 -C $CHANNEL_NAME -n b4s $PEER_CONN_PARMS --isInit -c '{"function":"org.b4s.quc:instantiate", "Args":[]}' >&log.txt
    res=$?
    set +x
  else
    set -x
    peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA -C $CHANNEL_NAME -n b4s $PEER_CONN_PARMS --isInit -c '{"function":"org.b4s.quc:instantiate", "Args":[]}' >&log.txt
    res=$?
    set +x
  fi
  cat log.txt
  verifyResult $res "Invoke execution on $PEERS failed "
  echo "===================== Invoke transaction successful on $PEERS on channel '$CHANNEL_NAME' ===================== "
  echo
}

chaincodeInvoke() {
  parsePeerConnectionParameters $@
  res=$?
  verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "

  # while 'peer chaincode' command can get the orderer endpoint from the
  # peer (if join was successful), let's supply it directly as we know
  # it using the "-o" option
  if [ -z "$CORE_PEER_TLS_ENABLED" -o "$CORE_PEER_TLS_ENABLED" = "false" ]; then
    set -x
    peer chaincode invoke -o localhost:7050 -C $CHANNEL_NAME -n b4s $PEER_CONN_PARMS  -c '{"function":"org.b4s.quc:instantiate", "Args":[]}' >&log.txt
    res=$?
    set +x
  else
    set -x
    peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA -C $CHANNEL_NAME -n b4s $PEER_CONN_PARMS -c '{"function":"org.b4s.quc:instantiate", "Args":[]}' >&log.txt
    res=$?
    set +x
	fi
  cat log.txt
  verifyResult $res "Invoke execution on $PEERS failed "
  echo "===================== Invoke transaction successful on $PEERS on channel '$CHANNEL_NAME' ===================== "
  echo
}

chaincodeQuery() {
  ORG=$1
  setGlobals $ORG
  echo "===================== Querying on peer0.org${ORG} on channel '$CHANNEL_NAME'... ===================== "
	local rc=1
	local COUNTER=1
	# continue to poll
  # we either get a successful response, or reach MAX RETRY
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
    sleep $DELAY
    echo "Attempting to Query peer0.org${ORG} ...$(($(date +%s) - starttime)) secs"
    set -x
    peer chaincode query -C $CHANNEL_NAME -n b4s -c '{"Args":["queryAllCars"]}' >&log.txt
    res=$?
    set +x
		let rc=$res
		COUNTER=$(expr $COUNTER + 1)
  done
  echo
  cat log.txt
  if test $rc -eq 0; then
    echo "===================== Query successful on peer0.org${ORG} on channel '$CHANNEL_NAME' ===================== "
		echo
  else
    echo "!!!!!!!!!!!!!!! After $MAX_RETRY attempts, Query result on peer0.org${ORG} is INVALID !!!!!!!!!!!!!!!!"
    echo
    exit 1
  fi
}


printinfo() {
  parsePeerConnectionParameters $@
  res=$?
  echo 'CORE_PEER_TLS_ENABLED'
   echo $CORE_PEER_TLS_ENABLED
    echo 'CHANNEL_NAME'
    echo $CHANNEL_NAME
    echo 'PEER_CONN_PARMS'
    echo $PEER_CONN_PARMS
}
## at first we package the chaincode
packageChaincode 1

## Install chaincode on peer0.org1 and peer0.org2
echo "Installing chaincode on peer0.org1..."
installChaincode 1
echo "Install chaincode on peer0.org2..."
installChaincode 2

## query whether the chaincode is installed
queryInstalled 1

## approve the definition for org1
approveForMyOrg 1

## check whether the chaincode definition is ready to be committed
## expect org1 to have approved and org2 not to
checkCommitReadiness 1 "\"Org1MSP\": true" "\"Org2MSP\": false"
checkCommitReadiness 2 "\"Org1MSP\": true" "\"Org2MSP\": false"

## now approve also for org2
approveForMyOrg 2

## check whether the chaincode definition is ready to be committed
## expect them both to have approved
checkCommitReadiness 1 "\"Org1MSP\": true" "\"Org2MSP\": true"
checkCommitReadiness 2 "\"Org1MSP\": true" "\"Org2MSP\": true"

## now that we know for sure both orgs have approved, commit the definition
commitChaincodeDefinition 1 2

## query on both orgs to see that the definition committed successfully
queryCommitted 1
queryCommitted 2

## Invoke the chaincode
chaincodeInvokeInit 1 2

printinfo

sleep 10

## Invoke the chaincode
chaincodeInvoke 1 2

exit 0
