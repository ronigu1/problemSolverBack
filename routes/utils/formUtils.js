const DButils = require('./DButils');

async function insertFormRow(userID, problemDescription, deviceSerialNum, statusLight1, statusLight2, statusLight3, responseStatus) {
    try {
        const data = {
            UserID: userID,
            ProblemDescription: problemDescription,
            DeviceSerialNumber: deviceSerialNum,
            StatusIndicatorLight1: statusLight1,
            StatusIndicatorLight2: statusLight2,
            StatusIndicatorLight3: statusLight3,
            ResponseStatus:responseStatus
          };
        await DButils.insertRow('Forms',data);
    } catch (error) {
        console.error(error);
    }
}
exports.insertFormRow = insertFormRow;
