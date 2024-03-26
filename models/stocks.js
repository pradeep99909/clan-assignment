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

/*
    Model explaination

    name: name of share eg. RELAINCE,
    volume: amount of perticalar share people holding,
    price: curent price of the share

*/