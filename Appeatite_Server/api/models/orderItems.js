const mongoose = require('mongoose');

const itemListSchema = mongoose.Schema({
  item_id: String,
  quantity: Number,
  item_name: String,
  item_price: Number
});
const orderListSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  order_id: Number,
  items_list: [itemListSchema],
  rest_id: String,
  item_total: Number,
  taxes: Number,
  convinience_fee: Number,
  grand_total: Number,
  date: Date
});

module.exports = mongoose.model('OrderItems', orderListSchema);
