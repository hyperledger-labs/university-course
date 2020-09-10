'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const path = require('path');
var glob = require("glob")

const fixtures = path.resolve(__dirname, '../../../../test-network');

async function renamePrivateKeys(paths)   {
    console.log(paths)
    paths.forEach( (path)=>   {
        // options is optional
        glob(path + "/*_sk",  function (er, files) {
            console.log(files + ' renamed to :' + path + '/priv_sk');
            if (er) {
                console.log(er)
            }
            fs.rename(files[0], path + "/priv_sk", function(err) {
                console.log("renamed")
                if ( err ) console.log('ERROR: ' + err);
            });
        })
    });
}


const path1 = path.join(fixtures,'/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore');
const path2 = path.join(fixtures,'/organizations/peerOrganizations/org1.example.com/users/studentUnionPresident@org1.example.com/msp/keystore');
const path3 = path.join(fixtures,'/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/keystore');


let paths = [path1,path2,path3];

renamePrivateKeys(paths).then(async () => {
    console.log('done');
}).catch((e) => {
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
});