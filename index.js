const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { routes } = require("./api/routes");

app.use(express.json({ urlencoded: false }));

app.use("/api/v1", routes);

const connection = mongoose.connect("mongodb://localhost:27017/assignment");


if(connection) {
   console.log("mongodb coonected!") 
}

app.listen(8080, () => console.log("App running on port 8080"))