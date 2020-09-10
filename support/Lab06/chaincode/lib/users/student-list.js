/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const StateList = require('../../ledger-api/statelist.js');
const Student = require('./student.js');

class StudentList extends StateList {
    /**
     * Student List: abstraction that manages Students
     * @constructor
     */
    constructor(ctx) {
        super(ctx, 'org.b4s.studentslist');
        this.use(Student);
    }

    async addStudent(student) {
        return this.addState(student);
    }

    async getStudent(studentKey) {
        return this.getState(studentKey);
    }

    async getAllStudents() {
            let query = {
                "selector": {
                    "class": "org.b4s.student"
                }
            };

            let prepared_query = JSON.stringify(query);
            return await this.getQueryResults(prepared_query);
    }


    async updateStudent(student) {
        await this.updateState(student);
    }

    async getStudentNumber ()   {
        let query = {
            "selector": {
                "class": "org.b4s.student"
            }
        };
        let prepared_query = JSON.stringify(query);
        const numberStudents = await this.getQueryResults(prepared_query);
        return numberStudents.length;
    }


}

module.exports = StudentList;
