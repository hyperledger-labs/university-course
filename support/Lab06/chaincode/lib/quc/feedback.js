/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const State = require('../../ledger-api/state.js');

const feedbackState = {
    CREATED: 0,
    COMPLETED: 1,
    PROCESSED: 2
};

//Professor's feedback is similar
class Feedback extends State {

    constructor(obj) {
        super(Feedback.getClass(), [obj.feedbackId, obj.creatorId]);
        this.currentState = feedbackState.CREATED;
        this.courseId = obj.courseId;
        this.feedbackParameter1 = null;

        //Feedback parameters
        //this.importanceTheoreticalClasses = obj.importanceTheoreticalClasses;
        //this.importanceLaboratoryClasses = obj.importanceLaboratoryClasses;
        //this.importanceofBibliography = obj.importanceofBibliography;

        this.producedQUC = null;
        Object.assign(this, obj);
    }

    //Other attributes are only retrieved in case of consensus within auditors
    setStateToCompleted() {
        this.currentState = feedbackState.COMPLETED;
    }

    evaluateParameter1 (score)    {
        this.feedbackParameter1 = score;
    }

    setStateToProcessed()   {
        this.currentState = feedbackState.PROCESSED;
    }

    getFeedbackScore()   {
        return this.feedbackParameters;
    }

    static fromBuffer(buffer) {
        return Feedback.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static deserialize(data) {
        return State.deserializeClass(data, Feedback);
    }

    /**
     * Factory method to create a Feedback Item
     */
    static createInstance(feedbackId, creatorId, courseId) {
        return new Feedback({ feedbackId, creatorId, courseId });
    }

    static getClass() {
        return "org.b4s.feedback";
    }
}

module.exports = Feedback;
