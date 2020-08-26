/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const State = require('../../ledger-api/state.js');

const courseState = {
    CREATED: 0,
    COMPLETED: 1,
    EVALUATED: 2
};

//course item
class Course extends State {

    constructor(obj) {
        //Creator ID corre  sponds to the university ID
        super(Course.getClass(), [obj.universityId, obj.courseId]);
        this.currentState = courseState.CREATED;
        this.courseId = obj.courseId;
        this.teachingStaff = obj.teachingStaff;
        this. students = obj.students;
        Object.assign(this, obj);
    }

    setStateToCompleted()   {
        this.currentState = courseState.COMPLETED;
    }

    setStateToProcessed()   {
        this.currentState = courseState.PROCESSED;
    }

    getTeachingStaff()  {
        return this.teachingStaff;
    }

    isCourseFinished() {
        return this.currentState === courseState.COMPLETED;
    }

    isCourseEvaluated() {
        return this.currentState === courseState.EVALUATED;
    }

    static fromBuffer(buffer) {
        return course.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static deserialize(data) {
        return State.deserializeClass(data, Course);
    }

    /**
     * Factory method to create a course Item
     */
    static createInstance(courseId, universityId, teachingStaff, students) {
        return new Course({ courseId, universityId, teachingStaff, students });
    }

    static getClass() {
        return "org.b4s.course";
    }
}

module.exports = Course;
