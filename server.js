const express = require("express");
require("dotenv").config();
var bodyParser = require("body-parser");
var enforce = require('express-sslify');
const app = express();

var port = process.env.PORT || 3000;


app.use(enforce.HTTPS());
app.use(bodyParser.json());
app.use(express.static("assets"));

//Setup DB
const connectString = process.env.PROD_MONGODB;
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(connectString, {
  useNewUrlParser: true
});

var database;
var db = client.connect().then(db => {});

db.then(success => {
  console.log("connected");
  database = client.db("heroku_wpdrx8dh");
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});

//Routes
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
app.get("/update", (req, res) => res.sendFile(__dirname + "/update.html"));

app.post("/update", (req, res) => {
  database
    .collection("state")
    .findOneAndUpdate({
      state: Object
    }, {
      $set: {
        state: req.body
      }
    });
  //respond to requester
  res.status(200).send("Location Updated Successfully!");
});

app.get("/status", (req, res) => {
  database.collection("state").findOne({
    state: Object
  }, (err, result) => {
    res.send(result);
  });
});