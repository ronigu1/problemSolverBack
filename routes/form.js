const express = require('express');
const router = express.Router();
const formUtils = require('./utils/formUtils');

function calculateResponse(deviceSerialNum, indicators) {
    console.log("2",deviceSerialNum);
    let res="Unknown device";
    if (!isNaN(deviceSerialNum)) {
        res="Bad serial number";
    }
    else if(deviceSerialNum.substr(0,4) === "24-X"){
        res="please upgrade your device";
    }
    else if(deviceSerialNum.substr(0,4) === "36-X"){
        if(indicators.every(indicator => indicator === "off")){
            res="turn on the device";
        }
        else if(indicators.filter(indicator => indicator === "blinking").length === 2){
            res="Please wait";
        }
        else if(indicators.every(indicator => indicator === "on")){
            res="ALL is ok";
        }
    }
    else if(deviceSerialNum.substr(0,4) === "51-B"){
        if(indicators.every(indicator => indicator === "off")){
            res="turn on the device";
        }
        else if(indicators.filter(indicator => indicator === "blinking").length >= 1){
            res="Please wait";
        }
        else if(indicators.filter(indicator => indicator === "on").length > 1){
            res="ALL is ok";
        }
    }
    return res
}


router.post("/insertFormRow", async (req, res, next) => {        
    console.log(req.body);
    try {
        const userID = req.body.userID;
        console.log("1","userID:",userID);
        const problemDescription = req.body.problemDescription;
        console.log("1","problemDescription:",problemDescription);
        let deviceSerialNum = req.body.deviceSerialNum;
        const statusLight1 = req.body.statusLight1;
        const statusLight2 = req.body.statusLight2;
        const statusLight3 = req.body.statusLight3;

        console.log("1","userID:",userID);
        console.log("1","deviceSerialNum",deviceSerialNum);
        let responseStatus = calculateResponse(req.body.deviceSerialNum,[statusLight1,statusLight2,statusLight3]);
        console.log(responseStatus);
        if(responseStatus === "Bad serial number" ){
            //because this value is defined as a string in the DB
            deviceSerialNum = deviceSerialNum.toString();
        }
        //check inputs in the front
        //calculate the “response status”
        console.log(userID,problemDescription,deviceSerialNum,statusLight1,statusLight2,statusLight3,responseStatus)
        const id = await formUtils.insertFormRow(userID, problemDescription, deviceSerialNum, statusLight1, statusLight2, statusLight3, responseStatus);
        res.status(200).send(responseStatus);
    }
    catch (error) {
      next(error);
    }
  });




  module.exports = router;