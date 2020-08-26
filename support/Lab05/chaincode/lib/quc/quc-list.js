/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../../ledger-api/statelist.js');
const QUC = require('./quc.js');

class QUCList extends StateList {
    /**
     * QUC List: abstraction that manages QUCs
     * @constructor
     */
    constructor(ctx) {
        super(ctx, 'org.b4s.quclist');
        this.use(QUC);
    }

    async addQUC(QUC) {
        return this.addState(QUC);
    }

    async getQUC(QUCKey) {
        return this.getState(QUCKey);
    }

    async getQUCFromCourse(courseId) {
        let query = {
            "selector": {
                "class": "org.b4s.QUC",
                "courseId": courseId
            }
        };

        let prepared_query = JSON.stringify(query);
        return await this.getQueryResults(prepared_query);
    }

    async getAllQUCs() {
            let query = {
                "selector": {
                    "class": "org.b4s.QUC"
                }
            };

            let prepared_query = JSON.stringify(query);
            return await this.getQueryResults(prepared_query);
    }


    async updateQUC(QUC) {
        await this.updateState(QUC);
    }

    async getQUCNumber ()   {
        let query = {
            "selector": {
                "class": "org.b4s.QUC"
            }
        };
        let prepared_query = JSON.stringify(query);
        const numberQUCs = await this.getQueryResults(prepared_query);
        return numberQUCs.length;
    }


}


module.exports = QUCList;
