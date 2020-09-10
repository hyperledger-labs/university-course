/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const State = require('../../ledger-api/state.js');

const studentState = {
    ACTIVE: 0,
    ALUMNI: 1,
};

class Student extends State {

    constructor(obj) {
        super(Student.getClass(), [obj.studentId, obj.universityId]);
        this.studentState = studentState.ACTIVE;

        // For each enrolled course, the student can provide a QUC vote, once.
        this.enrolledCourses = obj.enrolledCourses;
        Object.assign(this, obj);
    }

    getStudentId() {
        return this.studentId;
    }

    isStudent() {
        return true;
    }

    canVote(courseId)   {
        return this.enrolledCourses.includes(courseId);
    }

    removeQUCVote(courseId) {
        this.enrolledCourses = this.enrolledCourses.filter(item => item !== courseId);
    }

    isEnrolledAt(courseId)  {
        return this.enrolledCourses.includes(courseId);
    }

    static fromBuffer(buffer) {
        return Student.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static deserialize(data) {
        return State.deserializeClass(data, Student);
    }

    static createInstance(studentId, universityId , enrolledCourses) {
        return new Student({ studentId, universityId, enrolledCourses});
    }

    static getClass() {
        return 'org.b4s.student';
    }
}

module.exports = Student;
