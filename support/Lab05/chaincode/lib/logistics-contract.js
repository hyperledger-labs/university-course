/*
SPDX-License-Identifier: Apache-2.0
*/
'use strict';

const { Contract, Context } = require('fabric-contract-api');
const ClientIdentity = require('fabric-shim').ClientIdentity;


const Course = require('./logistics/course.js');
const University = require('./logistics/university.js');

const CourseList = require('./logistics/course-list.js');
const UniversityList = require('./logistics/university-list.js');

class LogisticsContext extends Context {

    constructor() {
        super();
        this.CourseList = new CourseList(this);
        this.UniversityList = new UniversityList(this);
    }

}

/** Audit smart contract */
class LogisticsContract extends Contract {

    constructor() {
        super('org.b4s.logistics');
    }

    createContext() {
        return new LogisticsContext();
    }

    async instantiate(ctx) {
        console.log('Instantiate the org.b4s.logistics smart contract');
    }

    // Code to be executed before a transaction is issued
    async beforeTransaction(ctx) {
    }

    // Code to be executed after a transaction is issued
    async afterTransaction(ctx) {
    }

    //Code to be executed if a transaction name is not known
    async unknownTransaction(ctx) {
        // This handler throws an exception
        throw new Error('Unknown transaction function');
    };


    async createMockData(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the org.b4s.quc chaincode');
    }

    async showIdentity(ctx) {
        let cid = new ClientIdentity(ctx.stub);
        console.log('Show identity called by: ', cid.getID());
        return {
            participantType: cid.getAttributeValue("participantType"),
            entityId: cid.getAttributeValue("entityId"),
            organizationName: cid.getAttributeValue("organizationName"),
            hfEnrollmentID: cid.getAttributeValue("hf.EnrollmentID"),
            getID: cid.getID(),
            getMSPID: cid.getMSPID(),
        };
    }

    //University should create the course
    async createCourse(ctx, courseId, universityId, teachingStaffIds, studentIds)   {
        //TODO Complete: Verification. Who can create a course?
        let course = Course.createInstance(courseId, universityId, teachingStaffIds, studentIds);
        await ctx.CourseList.addCourse(course);
        await ctx.stub.setEvent('newCourse', Buffer.from(JSON.stringify(course)));
        return course;
    }

    async completeCourse(ctx, universityId, courseId)   {
        //TODO Complete: Verification. Who can mark a course as completed?
        let key = Course.makeKey([universityId, courseId]);
        let course = CourseList.getCourse(key);
        await course.setStateToCompleted();
        await CourseList.updateCourse(course);
        return course;
    }

    async createUniversity(ctx, universityId, regionId) {
        //TODO Complete: Verification. Who can create a university?
        let university = University.createInstance(universityId, regionId);
        await ctx.UniversityList.addUniversity(university);
        return university;
    }

}

module.exports = LogisticsContract;
