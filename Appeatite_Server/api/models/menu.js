const mongoose = require('mongoose');

const menuSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id: String,
  name: String,
  category: [String],
  sub_category: [String],
  description: String,
  img_url: String,
  rating: Number,
  making_time: Number,
  availablity: Boolean,
  calories: Number,
  price: Number,
  isVeg: Boolean,
  remaining_capacity: Number,
});

module.exports = menuSchema;
