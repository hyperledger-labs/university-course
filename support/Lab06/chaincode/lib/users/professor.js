/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const State = require('../../ledger-api/state.js');

class Professor extends State {

    constructor(obj) {
        super(Professor.getClass(), [obj.universityId, obj.professorId]);
        Object.assign(this, obj);
    }

    getProfessorId() {
        return this.professorId;
    }

    isProfessor() {
        return true;
    }

    canVote(courseId)   {
        return this.courses.includes(courseId);
    }

    removeQUCVote(courseId) {
        this.enrolledCourses = this.enrolledCourses.filter(item => item !== courseId);
    }

    isEnrolledAt(courseId)  {
        return this.enrolledCourses.includes(courseId);
    }

    static fromBuffer(buffer) {
        return Professor.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static deserialize(data) {
        return State.deserializeClass(data, Professor);
    }

    static createInstance(universityId, professorId, courses) {
        return new Professor({ universityId, professorId, courses});
    }

    static getClass() {
        return 'org.b4s.professor';
    }
}

module.exports = Professor;
