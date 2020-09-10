var express = require('express');
var router = express.Router();
const Student = require('../../../../../chaincode/lib/users/student');
let contractPromise = require('../gateway');

router.post('/createStudent', async function(req, res, next) {
  try{
    let usersContract = await contractPromise('org2', 'universityTecnicoLisboa','org.b4s.user');

    //Parse arguments from CURL/user interface
    let studentId = req.body.studentId;
    let universityId = req.body.universityId;
    let courses = req.body.courses;

    const response = await usersContract.submitTransaction('createStudent', studentId, universityId, courses);
    const parsedResponse = Student.fromBuffer(response)
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

router.get('/getAllStudents', async function(req, res, next) {

  try{
    let usersContract = await contractPromise('org2', 'universityTecnicoLisboa','org.b4s.user');

    const response = await usersContract.submitTransaction('getAllStudents');
    const parsedResponse = Student.fromBuffer(response)
    console.log('===============')
    console.log(parsedResponse)
    let responseArray = []
    for (const element in parsedResponse) {
      if (!(element == parseInt(element))) {
        continue;
      }
      const parsedStudent = Student.deserialize(parsedResponse[element]);
      responseArray.push(parsedStudent)
      console.log('===============')
      console.log(`Student ID: ${parsedStudent.studentId}`);
      console.log(`Student's University ID: ${parsedStudent.universityId}`);
      console.log(`Student courses: ${parsedStudent.enrolledCourses}`);
      console.log('===============')
    }
    res.send(responseArray)
    console.log('Transaction complete.');

  } catch (error) {

    console.log(`Error processing transaction. ${error}`);
    res.status(200)
    res.send({message: `Error processing transaction. ${error}`, error: true});
    console.log(error.stack);

  }

});


module.exports = router;
