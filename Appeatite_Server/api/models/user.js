const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    id: Number,
    name: String,
    phno: {
      type: Number,
      unique: true,
    },
    email: String,
    password: String,
    orders: [String],
    gender: String,
    dob: String,
    paidOrders: [Number],
    verified: Boolean,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
