/*
SPDX-License-Identifier: Apache-2.0
Adapted from https://github.com/hyperledger/fabric-samples
*/

'use strict';
const State = require('./state.js');
class StateList {

    constructor(ctx, listName) {
        this.ctx = ctx;
        this.name = listName;
        this.supportedClasses = {};
    }

    /**
     * Add a state to the list. Creates a new state in worldstate with
     * appropriate composite key.  Note that state defines its own key.
     * State object is serialized before writing.
     */
    async addState(state) {
        let key = this.ctx.stub.createCompositeKey(this.name, state.getSplitKey());
        let data = State.serialize(state);
        await this.ctx.stub.putState(key, data);
    }
    /**
     * Update a state in the list. Puts the new state in world state with
     * appropriate composite key.  Note that state defines its own key.
     * A state is serialized before writing. Logic is very similar to
     * addState() but kept separate becuase it is semantically distinct.
     */
    async updateState(state) {
        let key = this.ctx.stub.createCompositeKey(this.name, state.getSplitKey());
        let data = State.serialize(state);
        await this.ctx.stub.putState(key, data);
    }
    /**
     * Get a state from the list using supplied keys. Form composite
     * keys to retrieve state from world state. State data is deserialized
     * into JSON object before being returned.
     */
    async getState(key) {
        let ledgerKey = await this.ctx.stub.createCompositeKey(this.name, State.splitKey(key));
        let data = await this.ctx.stub.getState(ledgerKey);
        if (data && data.toString()) {
            let state = State.deserialize(data, this.supportedClasses);
            return state;
        } else {
            throw new Error('No state with the key: ' + ledgerKey);
        }
    }

    async getStateFromCompositeKey(compositeKey) {
        let data = await this.ctx.stub.getState(compositeKey);
        if (data && data.toString()) {
            let state = State.deserialize(data, this.supportedClasses);
            return state;
        } else {
            throw new Error('No state with the key: ' + compositeKey);
        }
    }

    async getQueryResults (prepared_query)    {
        let iterator = await this.ctx.stub.getQueryResult(prepared_query);
        const queryResult = await this.getAllResults(iterator);
        return queryResult;
    }


    async getIteratorCompositeKey(objectName, attributes)    {
        return this.ctx.stub.getStateByPartialCompositeKey(objectName, attributes);
    }

    async getAllResults(iterator) {
        const allResults = [];
        while (true) {
            const res = await iterator.next();
            if (res.value) {
                allResults.push(res.value.value.toString('utf8'));
            }
            if (res.done) {
                await iterator.close();
                return allResults;
            }
        }
    }


    /** Stores the class for future deserialization */
    use(stateClass) {
        this.supportedClasses[stateClass.getClass()] = stateClass;
    }

}

module.exports = StateList;
