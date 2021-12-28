const restaurantModel = require('../../models/restaurant');
const logger = require('../../../config/logger')(module);

module.exports = async (restaurantId) => {
  try {
    return restaurantModel.find({ id: restaurantId }, 'menu', async (_err, menu) => {
      if (menu != null) {
        return menu;
      } else {
        throw new Error("No Items Available");
      }
    });
  } catch (error) {
    logger.log('error', `Fetching Restaurant, error: ${error}`);
    throw (error);
  }
};
