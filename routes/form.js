const express = require('express');
const router = express.Router();
const formUtils = require('./utils/formUtils');

function getNumsOfLights(indicators, lightName){
    return indicators.filter(indicator => indicator === lightName).length;
};

function calculateResponse(deviceSerialNum, indicators) {
    let res="Unknown device";
    //include the index 0 and not include the index 4 (0,1,2,3)
    let subStrFromStr =  deviceSerialNum.substr(0,4);
    let indicatorsNumOff;
    let indicatorsNumOn;
    let indicatorsNumBlinking;

    if (!isNaN(deviceSerialNum)) {
        res="Bad serial number";
        return res;
    }
    if(subStrFromStr === "24-X"){
        res="please upgrade your device";
        return res;
    }
    indicatorsNumOff = getNumsOfLights(indicators,"off");
    indicatorsNumOn = getNumsOfLights(indicators,"on");
    indicatorsNumBlinking = getNumsOfLights(indicators,"blinking");

    if(subStrFromStr === "36-X"){
        if(indicatorsNumOff === 4){
            res="turn on the device";
        }
        else if(indicatorsNumBlinking === 2){
            res="Please wait";
        }
        else if(indicatorsNumOn === 4){
            res="ALL is ok";
        }
        return res;
    }
    if(subStrFromStr === "51-B"){
        if(indicatorsNumOff === 4){
            res="turn on the device";
        }
        else if(indicatorsNumBlinking >= 1){
            res="Please wait";
        }
        else if(indicatorsNumOn > 1){
            res="ALL is ok";
        }
    }
    return res;
};

router.post("/insertFormRow", async (req, res, next) => {        
    try {
        const userID = req.body.userID;
        const problemDescription = req.body.problemDescription;
        let deviceSerialNum = req.body.deviceSerialNum;
        const statusLight1 = req.body.statusLight1;
        const statusLight2 = req.body.statusLight2;
        const statusLight3 = req.body.statusLight3;
        const statusLight4 = req.body.statusLight4;

        let responseStatus = calculateResponse(req.body.deviceSerialNum,[statusLight1,statusLight2,statusLight3,statusLight4]);
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

 
// function calculateResponse(deviceSerialNum, indicators) {
//     let res="Unknown device";
//     let subStrFromStr =  deviceSerialNum.substr(0,4);

//     if (!isNaN(deviceSerialNum)) {
//         res="Bad serial number";
//     }
//     else if(subStrFromStr === "24-X"){
//         res="please upgrade your device";
//     }
//     else if(subStrFromStr === "36-X"){
//         if(indicators.every(indicator => indicator === "off")){
//             res="turn on the device";
//         }
//         else if(getNumsOfLights(indicators,"blinking") === 2){
//             res="Please wait";
//         }
//         else if(indicators.every(indicator => indicator === "on")){
//             res="ALL is ok";
//         }
//     }
//     else if(subStrFromStr === "51-B"){
//         if(indicators.every(indicator => indicator === "off")){
//             res="turn on the device";
//         }
//         else if(getNumsOfLights(indicators,"blinking") >= 1){
//             res="Please wait";
//         }
//         else if(getNumsOfLights(indicators,"on") > 1){
//             res="ALL is ok";
//         }
//     }
//     return res
// };