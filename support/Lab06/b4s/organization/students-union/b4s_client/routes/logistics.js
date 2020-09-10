var express = require('express');
var router = express.Router();
let contractPromise = require('../gateway');

router.get('/myIdentity', async function(req, res, next) {
  try{
    let logisticsContract = await contractPromise('org1', 'studentUnionPresident','org.b4s.logistics');
    const response = await logisticsContract.submitTransaction('showIdentity');
    const parsedResponse =  JSON.parse(response.toString());
    console.log('identity: ', parsedResponse);
    let {id, participantType, organizationName} = parsedResponse;
    res.send({id,participantType,organizationName});

  } catch (error) {

    console.log(`Error processing transaction. ${error}`);
    res.send((`Error processing transaction. ${error}`));
    console.log(error.stack);

  }

});

module.exports = router;
