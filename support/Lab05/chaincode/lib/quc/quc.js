/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const State = require('../../ledger-api/state.js');

const QUCState = {
    CREATED: 0,
    PROCESSED: 1
};

//QUC item
class QUC extends State {

    constructor(obj) {
        //Creator ID corre  sponds to the university ID
        super(QUC.getClass(), [obj.QUCId, obj.universityId]);
        this.currentState = QUCState.CREATED;
        this.courseId = obj.courseId;
        this.teachingStaff = obj.teachingStaff;
        this.QUCScores = obj.QUCScores;
        this.teachingStaffQUCScores = obj.teachingStaffQUCScores;
        this.feedbackScores = obj.feedbackScores;
        this.generalScore = null;
        Object.assign(this, obj);
    }

    setStateToProcessed()   {
        this.currentState = QUCState.PROCESSED;
    }

    setQUCScore (score) {
        this.generalScore = score;
    }

    calculateQUCScore() {
        return this.mean(this.feedbackScores);
    }

    getCourseId()   {
        return this.courseId;
    }

    static fromBuffer(buffer) {
        return QUC.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static deserialize(data) {
        return State.deserializeClass(data, QUC);
    }

    /**
     * Factory method to create a QUC Item
     */
    static createInstance(QUCId, universityId, courseId, teachingStaff, feedbackScores) {
        return new QUC({ QUCId, universityId, courseId, teachingStaff, feedbackScores});
    }

    static getClass() {
        return "org.b4s.QUC";
    }

    mean(array)  {
        let total = 0;
        array.forEach( element => {
            total += element
        });
        return total/array.length;
    }
}

module.exports = QUC;
