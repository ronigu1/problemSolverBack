const express = require('express');
const router = express.Router();
const formUtils = require('./utils/formUtils');

function calculateResponse(deviceSerialNum, indicators) {
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
    try {
        const userID = req.body.userID;
        const problemDescription = req.body.problemDescription;
        let deviceSerialNum = req.body.deviceSerialNum;
        const statusLight1 = req.body.statusLight1;
        const statusLight2 = req.body.statusLight2;
        const statusLight3 = req.body.statusLight3;

        let responseStatus = calculateResponse(req.body.deviceSerialNum,[statusLight1,statusLight2,statusLight3]);
        if(responseStatus === "Bad serial number" ){
            //because this value is defined as a string in the DB
            deviceSerialNum = deviceSerialNum.toString();
        }
        //check inputs in the front
        //calculate the “response status”
        const id = await formUtils.insertFormRow(userID, problemDescription, deviceSerialNum, statusLight1, statusLight2, statusLight3, responseStatus);
        // status(200) by dufult
        res.send(responseStatus);
    }
    catch (error) {
      next(error);
    }
  });




  module.exports = router;