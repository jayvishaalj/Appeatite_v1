const logger = require('../../../config/logger')(module);
const { checkUserExists } = require('../../helpers/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../../config/keys');

/**
 *
 * @param {*} userData
 * @returns token or error
 */
module.exports = async (userData, password) => {
    try {
        const user = await checkUserExists({ phno: userData });
        if (user != null) {
            const validPassword = await bcrypt.compare(password, user.password);
            if (validPassword) {
                const token = jwt.sign({ _user: user }, JWT_SECRET);
                logger.log('info', `USER Login API CONTROLLER  ${JSON.stringify(userData)} , token: ${token}`);
                return token;
            } else {
                // not match
                throw new Error("Wrong Credentials!")
            }
        } else {
            // user doesnt exists
            throw new Error("User Doesn't Exist")
        }
    } catch (error) {
        logger.log('error', ` An error Occured at LOGIN USER Controller : ${error}`);
        throw (error);
    }
};
