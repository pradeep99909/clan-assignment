const mongoose = require("mongoose");
const { Schema } = mongoose;
const stockSchema = new Schema({
    name: String,
    volume: Number,
    price: mongoose.Types.Decimal128
}, {
    _id: false
});

module.exports = mongoose.model("stocks", stockSchema);