/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../../ledger-api/statelist.js');
const University = require('./university.js');

class UniversityList extends StateList {
    /**
     * University List: abstraction that manages universitys
     * @constructor
     */
    constructor(ctx) {
        super(ctx, 'org.b4s.universityslist');
        this.use(University);
    }

    async addUniversity(university) {
        return this.addState(university);
    }

    async getUniversity(universityKey) {
        return this.getState(universityKey);
    }

    async getAllUniversitys() {
            let query = {
                "selector": {
                    "class": "org.b4s.university"
                }
            };

            let prepared_query = JSON.stringify(query);
            return await this.getQueryResults(prepared_query);
    }


    async updateUniversity(university) {
        await this.updateState(university);
    }

    async getUniversityNumber ()   {
        let query = {
            "selector": {
                "class": "org.b4s.university"
            }
        };
        let prepared_query = JSON.stringify(query);
        const numberUniversitys = await this.getQueryResults(prepared_query);
        return numberUniversitys.length;
    }


}


module.exports = UniversityList;
