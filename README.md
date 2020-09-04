# VANET-Blockchain

A trust inference model on the hyperledger that is attack proof for communication in ephemeral networks such as vehicular adhoc networks (VANET). 

## General Info
The system comprises of :
* <strong>Trust inference model</strong> which involves calculating credibility of the event messages in the VANET using dynamic metrics and aggregating them through bayesian inference and

* <strong> Hyperledger </strong> Where the road-side units (RSUs) maintain the trust levels of the vehicles in the network using the credibility of their reports as a factor.
The hyperledger network used is modelled like the Commercial Paper network that can be found in [Hyperledger Fabric documentation](https://hyperledger-fabric.readthedocs.io/en/release-1.4/tutorial/commercial_paper.html).

## Steps

1) Execute the applications for the trust inference model
      - Calculate the credibility of a vehicle's report
      - Get the beta distribution of all the credibility of all these reports using bayesian inference
      - Aggregate these credibility report scores using the bayesian inference

2) Start the Hyperledger Fabric infrastructure. download the fabric binaries or cl

3) Install and Instantiate the Contracts

4) Run client applications in the roles of the RSUs to maintain the trust level values

   - Issue the trust level as an RSU
   - Update the trust level as an RSU
   - Query the trust level as a vehicle

## Setup

You will need a a machine with the following

- Docker and docker-compose installed
- Node.js v8 if you want to run Javascript client applications
- Python 3.6 or higher

The source code for the trust inference model is in the trust inference `directory`, while the source code for Hyperledger applications and the contracts is in the `ogranization` directory, and some helper scripts are in the `roles` directory.

In one console window, run the `./roles/network-starter.sh` script; this will start the basic infrastructure and also start monitoring all the docker containers. 


### Install and Instantiate the contract

Run the following command

`./roles/magnetocorp.sh`

This will start a docker container for Fabric CLI commands, and put you in the correct directory for the source code.  Then run the following:

```
docker exec cliMagnetoCorp peer chaincode install -n papercontract -v 0 -p /opt/gopath/src/github.com/contract -l node

docker exec cliMagnetoCorp peer chaincode instantiate -n papercontract -v 0 -l node -c '{"Args":["org.papernet.commercialpaper:instantiate"]}' -C mychannel -P "AND ('Org1MSP.member')"
```


## Execute Applications

install the dependencies first in each application directory using:

```
npm install
```

### Run the trust inference model
Compile and run the python files `Credibility_calc.py` , `beta_distribute.py` & `Bayesian_decision.py` for any of the operations you want to carry out.


### Issue the trust level

 Run these commands in the 
`VANET/organization/magnetocorp/application` directory.

*Add the Identity to be used*

```
node addToWallet.js

*Issue the Trust level*

```
node issue.js

### Update and Query the trust level

run the following command in the 
`fabric-samples/VANET /` directory

`./roles/digibank.sh` 

 Change to the 
`VANET/organization/digibank/application` directory.

*Add the Identity to be used*

```
node addToWallet.js

```

*Update the trust level*

```
node Update.js

```

*Query the trust level*

```
node query.js

```
