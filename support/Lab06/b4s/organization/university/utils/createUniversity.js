/*
SPDX-License-Identifier: Apache-2.0
*/
'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const University = require('../../../../chaincode/lib/logistics/university');


// Main program function
async function main() {
    console.log("=== CRETING A UNIVERSITY ===");
    console.log(__dirname);

    // A wallet stores a collection of identities for use
    const wallet = await Wallets.newFileSystemWallet('../identity/org2/wallet');

    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {

        // Specify userName for network access
        const userName = 'universityTecnicoLisboa';

        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/connection-org2.yaml', 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled:true, asLocalhost: true }
        };

        // Connect to gateway using utils specified parameters
        console.log('Connect to Fabric gateway.');
        await gateway.connect(connectionProfile, connectionOptions);

        console.log('Use network channel: mychannel.');
        const network = await gateway.getNetwork('mychannel');

        console.log('Use org.b4s.logistics smart contract.');

        const contract = await network.getContract('b4s','org.b4s.logistics');
        console.log('Submit create university transaction.');

        //ID, NAME, TIMESTAMP
        const universityBytes = await contract.submitTransaction('createUniversity', 'TecnicoLisboa', 'Portugal');

        // process response
        console.log('Process issue transaction response.');

        let university = University.fromBuffer(universityBytes);
        console.log(university)


    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    } finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
}
main().then(() => {

    console.log('Issue program complete.');

}).catch((e) => {

    console.log('Issue program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});