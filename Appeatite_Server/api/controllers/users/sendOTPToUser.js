const logger = require('../../../config/logger')(module);
const { addNewOTP, checkOTPExists } = require('../../helpers/OTP');
const { checkUserExists } = require('../../helpers/Users');

module.exports = async (userData) => {
    try {
        const user = await checkUserExists({ id: userData, verified: false });
        if (user != null) {
            const otpExists = await checkOTPExists({ user_id: userData });
            if (otpExists === null) {
                const otp = await addNewOTP(userData, 5);
                console.log('OTP ADDITION ', otp);
                // TODO: need to add messaging api
                return otp;
            } else {
                // already exists send OTP
                throw new Error("OTP Already Sent");
            }
        } else {
            // user doesnt exists
            throw new Error("User Doesn't exist")
        }
    } catch (error) {
        logger.log('error', ` An error Occured at SEND OTP TO USER Controller : ${error}`);
        return null;
    }
};
