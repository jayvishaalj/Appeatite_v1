const Restaurant = require('../models/restaurant');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const logger = require('../../config/logger')(module);


exports.getRestaurantCount = async () => {
    try {
        const count = await Restaurant.find().countDocuments();
        return count;
    } catch (error) {
        console.log(error);
        return null;
    }
};

exports.checkRestaurantExists = async (condition) => {
    const restaurant = await Restaurant.findOne(condition).exec();
    return restaurant;
};

exports.editRestaurantDetails = async (findCondition, updateValue) => {
    try {
        const restaurant = await Restaurant.updateOne(findCondition, updateValue);
        return restaurant;
    } catch (error) {
        console.log(error);
        return null;
    }
}

exports.addNewRestaurant = async (restaurantData, count) => {
    try {
        const password = await bcrypt.hash(restaurantData.password, 10);
        const restaurant = new Restaurant({
            ...restaurantData,
            _id: mongoose.Types.ObjectId(),
            id: `RES${count + 1}`,
            password
        });
        const saveRestaurant = await restaurant.save();
        logger.log('info', `Created a new restaurant ${JSON.stringify(saveRestaurant)}`)
        return saveRestaurant.id;
    } catch (error) {
        console.log(error);
        throw (error);
    }
};
