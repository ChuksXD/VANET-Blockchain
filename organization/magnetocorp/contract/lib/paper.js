/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

// Enumerate Trust state values
const trustState = {
    HIGHPRIORITY:1,
    TRUSTED:2,
    UNTRUSTED:3
};

/**
 * Trust class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class Trust extends State {

    constructor(obj) {
        super(Trust.getClass(), [obj.nodeID, obj.vehicleNumber]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */
    getVehicleNumber() {
        return this.vehicleNumber;
    }

    setVehicleNumber(vehicleNumber) {
        this.vehicleNumber =vehicleNumber;
    }

    getTrustValue() {
        return this.tvalue;
    }

    setTrustValue(tvalue) {
        this.tvalue = tvalue;
    }
    getState(){
      return this.trustState
    }

    /**
     * Useful methods to encapsulate trust states
     */
    setHighPriority() {
        this.currentState = trustState.HIGHPRIORITY;
    }

    setTrusted() {
        this.currentState = trustState.TRUSTED;
    }

    setUntrusted() {
        this.currentState = trustState.UNTRUSTED;
    }

    isHighPriority() {
        return this.currentState = trustState.HIGHPRIORITY;
    }

    isTrusted() {
        return this.currentState = trustState.TRUSTED;
    }

    isUntrusted() {
        return this.currentState = trustState.UNTRUSTED;
    }

    static fromBuffer(buffer) {
        return Trust.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Trust);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(nodeID, vehicleNumber, tvalue) {
        return new Trust({ nodeID, vehicleNumber, tvalue });
    }

    static getClass() {
        return 'org.papernet.trust';
    }
}

module.exports = Trust;
