const { getUserCount, checkUserExists, addNewUser } = require('../../helpers/Users');
const logger = require('../../../config/logger')(module);

module.exports = async (userData) => {
    const count = await getUserCount();
    const user = await checkUserExists({ phno: parseInt(userData.phno) });
    if (user === null) {
        const saveUser = await addNewUser(userData, count);
        return saveUser;
    } else if (user.verified === false) {
        throw new Error("User Already Present, Please Verify OTP!")
    } else {
        console.log("HERE")
        throw new Error('User Already Exist!')
    }
};

/**
 * {
  "name": "jayvishaalj",
  "phno": 7358125151,
  "email": "jay@jmail.com",
  "dob": "14-04-2000",
  "gender": "male",
  "password": "jayvishaal",
  "passwordRepeat": "jayvishaal"
}
 */
