const mongoose = require("mongoose");
const { Schema } = mongoose;
const portfolioSchema = new Schema({
    dematAccNo: String,
    symbol: String,
    quantity: Number,
    buyedPrice: Number
});

module.exports = mongoose.model("portfolio", portfolioSchema);

/*
    Model explaination

    dematAccNo: demat account number,
    symbol: ticker symbol of comapany eg: RELAINCE,
    quantity: number of quantity a port folio holding,
    buyedPrice: avareage price when nthe sahre is buyed

*/