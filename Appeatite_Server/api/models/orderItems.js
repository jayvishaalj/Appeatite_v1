const mongoose = require('mongoose');

const itemListSchema = mongoose.Schema({
  item_id: String,
  quantity: Number,
});
const orderListSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  order_id: Number,
  items_list: [itemListSchema],
  rest_id: String
});

module.exports = mongoose.model('OrderItems', orderListSchema);
