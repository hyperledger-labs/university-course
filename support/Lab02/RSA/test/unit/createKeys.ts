import {RSAService} from "../../rsa";
const tap = require("tap");

tap.test("create RSA keys from small p and q", async (assert: any) => {
    let rsa = new RSAService(3, 5);
    assert.ok(rsa);
    assert.ok(rsa.getPublicKey().getN() === 15);
    assert.ok(rsa.getPublicKey().getE() === 3);
    assert.ok(rsa.getPrivateKey().getN() === 15);
    assert.ok(rsa.getPrivateKey().getD() === 3);
    assert.end();
});

tap.test("create RSA keys from small p and q", async (assert: any) => {
    let rsa = new RSAService(3, 31);
    let a = rsa.decryptMessage(80,rsa.getPrivateKey());
    console.log(a)
    assert.ok(a);
    assert.end();
});

tap.test("create RSA keys from small p and q", async (assert: any) => {
    let rsa = new RSAService(11, 13);
    assert.ok(rsa);
    assert.ok(rsa.getPublicKey().getN() === 143);
    assert.ok(rsa.getPublicKey().getE() === 7);
    assert.ok(rsa.getPrivateKey().getN() === 143);
    assert.ok(rsa.getPrivateKey().getD() === 103);
    assert.end();
});

tap.test("create RSA keys from large p and q", async (assert: any) => {
    let rsa = new RSAService(199, 449);
    assert.ok(rsa);
    assert.ok(rsa.getPublicKey().getN() === 89351);
    assert.ok(rsa.getPublicKey().getE() === 5);
    assert.ok(rsa.getPrivateKey().getN() === 89351);
    assert.ok(rsa.getPrivateKey().getD() === 17741);
    assert.end();
});

