/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';


const { Contract, Context } = require('fabric-contract-api');
const ClientIdentity = require('fabric-shim').ClientIdentity;

const FeedbackItem = require('./quc/feedback.js');
const Course = require('./logistics/course.js');
const Student = require('./users/student.js');

const FeedbackList = require('./quc/feedback-list.js');
const CourseList = require('./logistics/course-list.js');
const StudentList = require('./users/student-list.js');
const QUCList = require('./quc/quc-list.js');



/**
 * A custom context provides easy access to list of all citius logs
 */
class QUCContext extends Context {

    constructor() {
        super();
        // All Citius logs are held in a list
        this.FeedbackList = new FeedbackList(this);
    }
}

/** Citius logs smart contract */
class QUCContract extends Contract {

    constructor() {
        super('org.b4s.quc');
    }

    /**
     * Define a custom context for a citius log
    */
    createContext() {
        return new QUCContext();
    }

    async beforeTransaction(ctx) {
    }

    async afterTransaction(ctx) {
    }

    async unknownTransaction(ctx) {
        // This handler throws an exception
        throw new Error('Unknown transaction function');
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the org.b4s.quc chaincode');
    }



    /**
     * Returns information about the identity of the caller
     */
    async showIdentity(ctx) {
        let cid = new ClientIdentity(ctx.stub);
        console.log('Show identity called by: ', cid.getID())
        return {
            participantType: cid.getAttributeValue("participantType"),
            entityId: cid.getAttributeValue("entityId"),
            hfEnrollmentID: cid.getAttributeValue("hf.EnrollmentID"),
            getID: cid.getID(),
            getMSPID: cid.getMSPID(),
        };
    }


    async createFeedback(ctx, feedbackId, studentId, universityId, courseId) {
        //TODO Complete: Verification. Who can create a feedback?
        let key = Student.makeKey([universityId, studentId]);
        let student = StudentList.getStudent(key);

        //Student should only vote once
        if (!student.canVote(courseId))  {
            throw new Error ('Student already answered to QUCs on the present course or does not have permission')
        }
        let feedback = FeedbackItem.createInstance(feedbackId, studentId, courseId);
        await ctx.FeedbackList.addFeedback(feedback);
        return feedback;
    }

    async fillFeedback(ctx, studentId, feedbackId, score) {
        //TODO Complete: Verification. Who and When can someone fill a feedback?
        let key = Feedback.makeKey([studentId, feedbackId]);
        let feedback = FeedbackList.getFeedback(key);
        await feedback.evaluateParameter1(score);
        await FeedbackList.updateFeedback(feedback);
        return feedback;
    }

    //Processes feedback. Creates a QUC item
    async processFeedback(ctx, qucId, courseId, universityId)  {
        //TODO Complete: Verification. Who and When can someone process a feedback?
        let key = Course.makeKey([universityId, courseId]);
        let course = await ctx.CourseList.getCourse(key);
        //Get all feedbacks relative to a courseID
        let relevantInformation = await ctx.FeedbackList.getFeedbackFromCourse(courseId);
        let feedbackScores = [];
        for (const feedback of relevantInformation) {
            feedbackScores.concat(feedback.getFeedbackScore());
            //Mark feedback as used
            feedback.setStateToProcessed();
            await FeedbackList.updateFeedback(feedback);
        }

        let teachingStaff = await course.getTeachingStaff();
        let quc = await QUC.createInstance(qucId, universityId, courseId, teachingStaff, feedbackScores);
        return quc;
    }
    async evaluateCourse(ctx, qucId, universityId)  {
        //TODO Complete: Verification. When can someone create a feedback?
        let key = QUC.makeKey([qucId, universityId]);
        let quc = QUCList.getQUC(key);
        await quc.calculateQUCScore();
        await quc.setStateToProcessed();

        let courseKey = Course.makeKey([universityId, quc.getCourseId()]);
        let course = CourseList.getCourse(courseKey);
        await course.setStateToProcessed();
        return quc;
    }


}

module.exports = QUCContract;
