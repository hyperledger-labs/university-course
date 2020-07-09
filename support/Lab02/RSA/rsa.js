"use strict";
exports.__esModule = true;
exports.RSAService = void 0;
var key_1 = require("./key");
var RSAService = /** @class */ (function () {
    function RSAService(p, q) {
        var gcd = this.gcd(p, q);
        console.log(gcd);
        if (gcd !== 1) {
            throw new Error("p and q need to be primes. Their gcd is: , " + gcd);
        }
        this.n = p * q;
        this.z = (p - 1) * (q - 1);
        this.e = [];
        this.d = [];
        this.defineE(this.z);
        this.createPublicKey();
        this.defineD(this.z, this.e[0]);
        this.createPrivateKey();
    }
    RSAService.prototype.defineE = function (z) {
        for (var e = 2; e < z; e++) {
            if (this.gcd(e, z) == 1) {
                this.e.push(e);
            }
        }
        return;
    };
    RSAService.prototype.createPublicKey = function () {
        this.Ku = new key_1.PublicKey(this.n, this.e);
        return;
    };
    RSAService.prototype.defineD = function (z, e) {
        for (var d = 0; d < z; d++) {
            if ((e * d) % z === 1) {
                this.d.push(d);
            }
        }
    };
    RSAService.prototype.createPrivateKey = function () {
        this.Kr = new key_1.PrivateKey(this.n, this.d);
        return;
    };
    RSAService.prototype.getPublicKey = function () {
        return this.Ku;
    };
    RSAService.prototype.getPrivateKey = function () {
        return this.Kr;
    };
    // M = M(Kr) mod N
    RSAService.prototype.encryptMessage = function (message, Ku) {
        //Check number < N
        if (message >= this.n) {
            throw Error('Message cannot be higher than N = p.q');
        }
        var e = Ku.getE();
        return (Math.pow(message, e)) % this.n;
    };
    // C = C(Kr) mod N
    RSAService.prototype.decryptMessage = function (message, Kr) {
        var d = Kr.getD();
        return (Math.pow(message, d)) % this.n;
    };
    // Calculates the greatest common divisor recursively
    RSAService.prototype.gcd = function (a, b) {
        if (!b) {
            return a;
        }
        return this.gcd(b, a % b);
    };
    return RSAService;
}());
exports.RSAService = RSAService;
