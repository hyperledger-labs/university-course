/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../../ledger-api/statelist.js');
const Course = require('./course.js');

class CourseList extends StateList {
    /**
     * Course List: abstraction that manages Courses
     * @constructor
     */
    constructor(ctx) {
        super(ctx, 'org.b4s.courseslist');
        this.use(Course);
    }

    async addCourse(course) {
        return this.addState(course);
    }

    async getCourse(courseKey) {
        return this.getState(courseKey);
    }

    async getAllCourses() {
            let query = {
                "selector": {
                    "class": "org.b4s.course"
                }
            };

            let prepared_query = JSON.stringify(query);
            return await this.getQueryResults(prepared_query);
    }


    async updateCourse(course) {
        await this.updateState(course);
    }

    async getCourseNumber ()   {
        let query = {
            "selector": {
                "class": "org.b4s.course"
            }
        };
        let prepared_query = JSON.stringify(query);
        const numberCourses = await this.getQueryResults(prepared_query);
        return numberCourses.length;
    }


}


module.exports = CourseList;
