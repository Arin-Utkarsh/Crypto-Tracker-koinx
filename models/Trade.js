// models/Trade.js
const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  userId: Number,
  utcTime: Date,
  operation: String,
  market: String,
  baseCoin: String,
  quoteCoin: String,
  amount: Number,
  price: Number,
});

module.exports = mongoose.model('Trade', tradeSchema);
