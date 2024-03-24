const mongoose = require("mongoose");
const { Schema } = mongoose;
const portfolioSchema = new Schema({
    dematAccNo: String,
    symbol: String,
    quantity: Number,
    buyedPrice: Number
});

module.exports = mongoose.model("portfolio", portfolioSchema);