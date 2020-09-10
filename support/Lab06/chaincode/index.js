/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const QUCContract = require('./lib/quc-contract.js');
const LogisticsContract = require('./lib/logistics-contract.js');
const UserContract = require('./lib/user-contract.js');
module.exports.contracts = [QUCContract,LogisticsContract,UserContract];
