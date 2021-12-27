const OTP = require('../models/otp');
const mongoose = require('mongoose');

const getOTP = require('../middlewares/getOTP')

/**
 *
 * @param {*} user_id  condition
 * @returns otp record if exists
 */
exports.checkOTPExists = async (condition) => {
    const otp = await OTP.findOne(condition).exec();
    return otp;
};

/**
 *
 * @param {number} user_id
 * @param {number} length
 * @returns creates a new otp for a user
 */
exports.addNewOTP = async (userData, length) => {
    try {
        const otp = new OTP({
            _id: mongoose.Types.ObjectId(),
            user_id: userData,
            otp: getOTP(length),
        });
        await otp.save();
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

/**
 *
 * @param {*} user_id  condition
 * @returns deleted otp record
 */
exports.removeOTP = async (condition) => {
    try {
        const otp = await OTP.deleteOne(condition);
        return otp;
    } catch (error) {
        console.log(error);
        return null;
    }
};
