const logger = require('../../../config/logger')(module);
const { checkOTPExists, removeOTP } = require('../../helpers/OTP');
const { checkUserExists, updateUser } = require('../../helpers/Users');

/**
 *
 * @param {*} userData
 * @param {*} otpNumber
 * @returns 0 or 1 or 2 or -1
 */
module.exports = async (userData, otpNumber) => {
    try {
        const user = await checkUserExists({ id: userData });
        if (user != null) {
            if (user.verified === false) {
                const otpExists = await checkOTPExists({ user_id: userData, otp: otpNumber });
                if (otpExists != null) {
                    // delete otp from collection
                    await removeOTP({ user_id: userData, otp: otpNumber });
                    logger.log('info', `OTP Verified for user ${userData}`);
                    // make user verificatoin true
                    await updateUser({ id: userData }, { verified: true });
                    return true;
                } else {
                    throw new Error("Wrong OTP!");
                }
            } else {
                throw new Error("User Already Verfied!")
            }
        } else {
            // user doesnt exists
            throw new Error("User Doesn't exist");
        }
    } catch (error) {
        logger.log('error', ` An error Occured at SEND OTP TO USER Controller : ${JSON.stringify(error)}`);
        return null;
    }
};
