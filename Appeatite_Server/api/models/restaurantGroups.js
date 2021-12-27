const mongoose = require('mongoose');

const restaurantSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: String,
    name: String,
    rest_ids: [String]
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
