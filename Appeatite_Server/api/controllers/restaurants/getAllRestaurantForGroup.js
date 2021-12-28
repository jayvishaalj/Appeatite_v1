const restaurantModel = require('../../models/restaurant');
const logger = require('../../../config/logger')(module);

module.exports = async (groupId) => {
  try {
    return restaurantModel.find({ group_id: groupId }, 'id name address phone img_url', async (_err, restaurant) => {
      if (restaurant != null) {
        return restaurant;
      } else {
        throw new Error("Restaurants Not there");
      }
    });
  } catch (error) {
    logger.log('error', `Fetching Restaurant, error: ${error}`);
    throw (error);
  }
};
