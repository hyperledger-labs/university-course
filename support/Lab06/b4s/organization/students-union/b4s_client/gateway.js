const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const connectionProfilePath = path.join(__dirname,'../gateway/connection-org1.yaml')
let connectionProfile = yaml.safeLoad(fs.readFileSync(connectionProfilePath));

async function getContract(org, user, smartcontract) {
    try {
    const { Wallets, Gateway } = require('fabric-network');
    const wallet = await Wallets.newFileSystemWallet('../identity/' + org + '/wallet');

    const gateway = new Gateway();
    // Specify userName for network access
    // const userName = 'NunoFonseca.issuer@csm_org.com';
    const userName = user;

    // Load connection profile; will be used to locate a gateway

    // Set connection options; identity and wallet
    let connectionOptions = {
        identity: userName,
        wallet: wallet,
        discovery: {enabled: true, asLocalhost: true}
    };

    console.log('Connecting to Fabric');

    await gateway.connect(connectionProfile, connectionOptions);

    console.log('Use network channel: mychannel.');

    const network = await gateway.getNetwork('mychannel');

    console.log('Use org.b4s chaincode');
    return await network.getContract('b4s', smartcontract);
    }   catch (e) {
        throw new Error(e);
    }
}

module.exports = getContract;