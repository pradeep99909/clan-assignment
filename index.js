require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { routes } = require("./api/routes");

const mongodburl = process.env.MONGO_DB_URL;
const port = process.env.PORT || 8080
app.use(express.json({ urlencoded: false }));

app.use("/api/v1", routes);

const connection = mongoose.connect(process.env.MONGO_DB_URL);


if(connection) {
   console.log("mongodb coonected!") 
}

app.listen(port, () => console.log("App running on port 8080"))