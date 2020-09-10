var express = require('express');
var router = express.Router();
const University = require('../../../../../chaincode/lib/logistics/university');
const Student = require('../../../../../chaincode/lib/users/student');
let contractPromise = require('../gateway');

router.post('/createUniversity', async function(req, res, next) {

  try{
    let logisticsContract = await contractPromise('org2', 'universityTecnicoLisboa','org.b4s.logistics');

    //Parse arguments from CURL/user interface
    let universityId = req.body.universityId;
    let regionId = req.body.regionId;

    const response = await logisticsContract.submitTransaction('createUniversity', universityId, regionId);
    const parsedResponse = University.fromBuffer(response)
    console.log('===============')
    console.log(parsedResponse)
    res.send(parsedResponse)
    console.log('Transaction complete.');

  } catch (error) {
    console.log(`Error processing transaction. ${error}`);
    res.status(200)
    res.send({message: `Error processing transaction. ${error}`, error: true});
    console.log(error.stack);
  }
});


router.get('/myIdentity', async function(req, res, next) {
  try{
    let logisticsContract = await contractPromise('org2', 'universityTecnicoLisboa','org.b4s.logistics');
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
