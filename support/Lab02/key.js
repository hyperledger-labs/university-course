"use strict";
exports.__esModule = true;
exports.PrivateKey = exports.PublicKey = void 0;
var PublicKey = /** @class */ (function () {
    function PublicKey(n, e) {
        this.n = n;
        this.eArray = e;
        this.e = e[0];
    }
    PublicKey.prototype.getE = function () {
        return this.e;
    };
    PublicKey.prototype.getEArray = function () {
        return this.eArray;
    };
    PublicKey.prototype.getN = function () {
        return this.n;
    };
    return PublicKey;
}());
exports.PublicKey = PublicKey;
var PrivateKey = /** @class */ (function () {
    function PrivateKey(n, d) {
        this.n = n;
        this.d = d[0];
        this.dArray = d;
    }
    PrivateKey.prototype.getD = function () {
        return this.d;
    };
    PrivateKey.prototype.getDArray = function () {
        return this.dArray;
    };
    PrivateKey.prototype.getN = function () {
        return this.n;
    };
    return PrivateKey;
}());
exports.PrivateKey = PrivateKey;
