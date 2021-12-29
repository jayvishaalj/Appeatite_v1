const restaurantModel = require('../../models/restaurant');
const logger = require('../../../config/logger')(module);

module.exports = async (restaurantId) => {
  try {
    const menu = await restaurantModel.findOne({ id: restaurantId }, 'menu');
    if (menu != null && menu.menu !== null) {
      return menu.menu;
    } else {
      throw new Error("No Items Available");
    }
  } catch (error) {
    logger.log('error', `Fetching Restaurant, error: ${error}`);
    throw (error);
  }
};
