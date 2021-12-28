const mongoose = require('mongoose');
const menuSchema = require('./menu');

const restaurantSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id: String,
  name: String,
  address: String,
  phno: Number,
  password: String,
  img_url: String,
  lat: Number,
  long: Number,
  merchant_id: Number,
  group_id: String,
  menu: [menuSchema],
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
