/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const Trust = require('./paper.js');

class TrustList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.papernet.trustlist');
        this.use(Trust);
    }

    async addTrust(trust) {
        return this.addState(trust);
    }

    async getTrust(trustKey) {
        return this.getState(trustKey);
    }

    async updateTrust(trust) {
        return this.updateState(trust);
    }
}


module.exports = TrustList;
