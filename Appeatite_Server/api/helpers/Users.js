const User = require('../models/user');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const logger = require('../../config/logger')(module);

exports.getUserCount = async () => {
    try {
        const count = await User.find().countDocuments();
        return count;
    } catch (error) {
        console.log(error);
        return null;
    }
};

exports.checkUserExists = async (condition) => {
    const user = await User.findOne(condition).exec();
    return user;
};

exports.addNewUser = async (userData, count) => {
    try {
        const password = await bcrypt.hash(userData.password, 10);
        const user = new User({
            _id: mongoose.Types.ObjectId(),
            id: count + 1,
            name: userData.name,
            phno: userData.phno,
            email: userData.email,
            password: password,
            orders: [],
            gender: userData.gender,
            dob: userData.dob,
            verified: false,
        });
        const saveUser = await user.save();
        logger.log('info', `Created a new user ${JSON.stringify(saveUser)}`)
        return saveUser.id;
    } catch (error) {
        console.log(error);
        return null;
    }
};

/**
 *
 * @param {json} findCondition
 * @param {json} updateValue
 * @returns
 */
exports.updateUser = async (findCondition, updateValue) => {
    try {
        const user = await User.findOneAndUpdate(findCondition, updateValue);
        console.log(user);
        return user;
    } catch (error) {
        console.log(error);
        return null;
    }
};
