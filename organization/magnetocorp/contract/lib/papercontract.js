/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// PaperNet specifc classes
const Trust = require('./paper.js');
const TrustList = require('./paperlist.js');

/**
 * A custom context provides easy access to list of all Trust values
 */
class TrustContext extends Context {

    constructor() {
        super();
        // All Trust values are held in a list of Trust values
        this.trustList = new TrustList(this);
    }

}

/**
 * Define Trust smart contract by extending Fabric Contract class
 *
 */
class TrustContract extends Contract {

    constructor() {
        // Unique name when multiple contracts per chaincode file
        super('org.papernet.trust');
    }

    /**
     * Define a custom context for Trust value
    */
    createContext() {
        return new TrustContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    /**
     * Create Vehicle Trust value
     *
     * @param {Context} ctx the transaction context
     * @param {String} nodeID RSU that initiates transaction
     * @param {Integer} vehicleNumber vehicle number
     * @param {Integer} tValue trust value number
    */
    async setTrustValue(ctx, nodeID, vehicleNumber,tValue) {

        // create an instance of the Trust
        let vehicleTrust = Trust.createInstance(nodeID, vehicleNumber,tValue);

        // Smart contract, rather than Trust, moves vehicleTrust into HIGHPRIORITY OR TRUSTED state
        if(vehicleNumber == 911){
        vehicleTrust.setHighPriority();
      }
        else{
          vehicleTrust.setTrusted();
        }

        // Trust value is set
        vehicleTrust.setTrustValue(tValue);

        // Add the vehicle trust to the list of all Trust values in the ledger world state
        await ctx.trustList.addTrust(vehicleTrust);

        // Must return a serialized Vehicle Trust to caller of smart contract
        return vehicleTrust;
    }

    /**
     * Update Trust Values
     *
     * @param {Context} ctx the transaction context
     * @param {String} nodeID RSU that initiates transaction
     * @param {Integer} vehicleNumber vehicle number
     * @param {Integer} offset Trust value offset
    */
    async updateTrustValue(ctx, nodeID, vehicleNumber, offset) {

        // Retrieve the current vehicle Trust value using key fields provides
        let vehicleTrustKey = Trust.makeKey([nodeID, vehicleNumber]);
        let vehicleTrust = await ctx.trustList.getTrust(vehicleTrustKey);


        // The offset is added to the trust value

        const oldTvalue = parseInt(vehicleTrust.getTrustValue());

        const newTValue = parseInt(offset) + oldTvalue;


        vehicleTrust.setTrustValue(newTValue);

        //trust state is updated accrodingly

        if (newTValue >= 8){
          vehicleTrust.setHighPriority();

        }
        else if (newTValue >= 5 && newTValue < 8 ) {
          vehicleTrust.setTrusted();
        }
        else {
          vehicleTrust.setUntrusted();
        }


        // Update the trust value
        await ctx.trustList.updateTrust(vehicleTrust);
        return vehicleTrust;
    }

    /**
     * Query Vehicle Trust value
     *
     * @param {Context} ctx the transaction context
     * @param {String} nodeID RSU that initiates transaction
     * @param {Integer} vehicleNumber vehicle number
    */
    async queryTrustValue(ctx, nodeID, vehicleNumber) {

      let vehicleTrustKey = Trust.makeKey([nodeID, vehicleNumber]);
      let vehicleTrust = await ctx.trustList.getTrust(vehicleTrustKey);

        // Print Trust Value and state
        //console.log(vehicleTrust.toString());
        console.log(vehicleTrust.getState())
        return vehicleTrust;

    }

}

module.exports = TrustContract;
