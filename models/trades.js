const mongoose = require("mongoose");
const { Schema } = mongoose;
const tradeSchema = new Schema({
    time: Number,
    currentPrice: Number,
    quantity: Number,
    dematAccNo: String,
    type: Number,
    symbol: String
});

module.exports = mongoose.model("trades", tradeSchema);