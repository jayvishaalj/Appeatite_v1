const { checkUserExists } = require('../helpers/Users');

module.exports = async (user, orderDetails) => {
  console.log('U : ', user, 'OD : ', orderDetails);
  try {
    const userExist = await checkUserExists({ id: user.id });
    const orderExists = userExist.orders.find((order) => order === orderDetails.order_id);
    console.log('OE : ', orderExists);
    if (orderExists.length === 1) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return null;
  }
};
