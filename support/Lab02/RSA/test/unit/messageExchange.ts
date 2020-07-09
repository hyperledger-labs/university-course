import {RSAService} from "../../rsa";
const tap = require("tap");

// Expected to throw an Error, because small primes 3 and 5 do not support message 65
/*
tap.test("encrypt single letter", async (assert: any) => {
    let rsa = new RSAService(3, 5);
    const Ku = rsa.getPublicKey();
    // A = 65 in ASCII
    rsa.encryptMessage(65, Ku);
    assert.throw(function(){throw Error('Message cannot be higher than N = p.q')},{}, {skip: true});

});
*/

tap.test("encrypt single letter", async (assert: any) => {
    let rsa = new RSAService(11, 13);
    const Ku = rsa.getPublicKey();
    // C = 67 in ASCII
    const message = rsa.encryptMessage(67, Ku);
    assert.equal(message, 89);
    assert.end();
});

tap.test("decrypt single letter", async (assert: any) => {
    let rsa = new RSAService(11, 13);
    const Kr = rsa.getPrivateKey();
    // C = 67 in ASCII
    const message = rsa.decryptMessage(89, Kr);
    assert.equal(message, 27);
    assert.end();
});


