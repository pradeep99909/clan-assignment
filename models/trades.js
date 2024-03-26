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

/*
    Model explaination

    time: time when it was traded,
    currentPrice: price buyed at,
    quantity: quantity buyed selled at the time,
    dematAccNo: demat account number,
    type: buye of selling trade,
    symbol: ticker symbol of the share

*/