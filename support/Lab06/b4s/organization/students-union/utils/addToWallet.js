/*
 *  SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const { Wallets } = require('fabric-network');
const path = require('path');
var glob = require("glob")

const fixtures = path.resolve(__dirname, '../../../../test-network');

async function main() {
    const credPath = path.join(fixtures, '/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com');
    const certificate = fs.readFileSync(path.join(credPath, '/msp/signcerts/cert.pem')).toString();
    let partialPath = path.join(credPath, '/msp/keystore');
    const privateKeyPath = path.join(credPath, '/msp/keystore/priv_sk');
    const wallet = await Wallets.newFileSystemWallet('../identity/org1/wallet');
    // Main try/catch block
    try {
        if (!fs.existsSync(privateKeyPath)) {
            await renamePrivateKeys(partialPath);
        }
        let privateKey = await fs.readFileSync(privateKeyPath).toString();
        // Load credentials into wallet
        let identityLabel = 'admin';

        let identity = {
            credentials: {
                certificate,
                privateKey
            },
            mspId: 'Org1MSP',
            type: 'X.509'
        }

        console.log('============================');
        console.log(`Adding ${identityLabel} from ${identity.mspId}`);
        await wallet.put(identityLabel, identity);
    } catch (error) {
        console.log(`Error adding User to wallet. ${error}`);
        console.log(error.stack);
    }
}


async function addUser() {
    const credPath = path.join(fixtures, '/organizations/peerOrganizations/org1.example.com/users/studentUnionPresident@org1.example.com');
    const certificate = fs.readFileSync(path.join(credPath, '/msp/signcerts/cert.pem')).toString();
    let partialPath = path.join(credPath, '/msp/keystore');
    const privateKeyPath = path.join(credPath, '/msp/keystore/priv_sk');
    const wallet = await Wallets.newFileSystemWallet('../identity/org1/wallet');
    // Main try/catch block
    try {
        if (!fs.existsSync(privateKeyPath)) {
            await renamePrivateKeys(partialPath);
            setTimeout(()=>{}, 100)
        }
        const privateKey = fs.readFileSync(path.join(credPath, '/msp/keystore/priv_sk')).toString();
        // Load credentials into wallet
        let identityLabel = 'studentUnionPresident';

        let identity = {
            credentials: {
                certificate,
                privateKey
            },
            mspId: 'Org1MSP',
            type: 'X.509'
        }

        console.log('============================');
        console.log(`Adding ${identityLabel} from ${identity.mspId}`);
        await wallet.put(identityLabel, identity);
    } catch (error) {
        console.log(`Error adding User to wallet. ${error}`);
        console.log(error.stack);
    }
}


async function renamePrivateKeys(path)   {

    // options is optional
    glob(path + "/*_sk", function (er, files) {
        console.log(files + ' renamed to :' + path + '/priv_sk');
        if (er) {
            console.log(er)
        }
        fs.rename(files[0], path + "/priv_sk", function(err) {
            if ( err ) console.log('ERROR: ' + err);
        });
    })

}

main().then(() => {
    console.log('done');
}).catch((e) => {
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
});

addUser().then(() => {
    console.log('done');
}).catch((e) => {
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
});




