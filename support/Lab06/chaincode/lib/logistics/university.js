/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const State = require('../../ledger-api/state.js');

/** Class representing an university. */
class University extends State {

    constructor(obj) {
        super(University.getClass(), [obj.universityId, obj.regionId]);
        Object.assign(this, obj);

    }

    getuniversityId() {
        return this.universityId;
    }


    static fromBuffer(buffer) {
        return University.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static deserialize(data) {
        return State.deserializeClass(data, University);
    }

    static createInstance(universityId, regionId) {
        return new University({ universityId, regionId });
    }

    static getClass() {
        return 'org.b4s.university';
    }
}

module.exports = University;
