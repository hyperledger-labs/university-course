/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../../ledger-api/statelist.js');
const Feedback = require('./feedback.js');

class FeedbackList extends StateList {
    /**
     * Feedback List: abstraction that manages Feedbacks
     * @constructor
     */
    constructor(ctx) {
        super(ctx, 'org.b4s.feedbacklist');
        this.use(Feedback);
    }

    async addFeedback(feedback) {
        return this.addState(feedback);
    }

    async getFeedback(feedbackKey) {
        return this.getState(feedbackKey);
    }

    async getFeedbackFromCourse(courseId) {
        let query = {
            "selector": {
                "class": "org.b4s.feedback",
                "courseId": courseId
            }
        };

        let prepared_query = JSON.stringify(query);
        return await this.getQueryResults(prepared_query);
    }

    async getAllFeedbacks() {
            let query = {
                "selector": {
                    "class": "org.b4s.feedback"
                }
            };

            let prepared_query = JSON.stringify(query);
            return await this.getQueryResults(prepared_query);
    }


    async updateFeedback(feedback) {
        await this.updateState(feedback);
    }

    async getFeedbackNumber ()   {
        let query = {
            "selector": {
                "class": "org.b4s.feedback"
            }
        };
        let prepared_query = JSON.stringify(query);
        const numberFeedbacks = await this.getQueryResults(prepared_query);
        return numberFeedbacks.length;
    }


}


module.exports = FeedbackList;
