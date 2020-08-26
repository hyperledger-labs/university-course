/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../../ledger-api/statelist.js');
const Professor = require('./professor.js');

class ProfessorList extends StateList {
    /**
     * professor List: abstraction that manages professors
     * @constructor
     */
    constructor(ctx) {
        super(ctx, 'org.b4s.professorslist');
        this.use(Professor);
    }

    async addProfessor(professor) {
        return this.addState(professor);
    }

    async getProfessor(professorKey) {
        return this.getState(professorKey);
    }

    async getAllProfessors() {
            let query = {
                "selector": {
                    "class": "org.b4s.professor"
                }
            };

            let prepared_query = JSON.stringify(query);
            return await this.getQueryResults(prepared_query);
    }


    async updateProfessor(professor) {
        await this.updateState(professor);
    }

    async getProfessorNumber ()   {
        let query = {
            "selector": {
                "class": "org.b4s.professor"
            }
        };
        let prepared_query = JSON.stringify(query);
        const numberProfessors = await this.getQueryResults(prepared_query);
        return numberProfessors.length;
    }


}


module.exports = ProfessorList;
