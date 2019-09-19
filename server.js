const express = require("express");
require("dotenv").config();
var bodyParser = require("body-parser");
var enforce = require('express-sslify');
const app = express();

var http = require('http').createServer(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 3000;

// TODO: Disable HTTPS for dev
app.use(enforce.HTTPS({
  trustProtoHeader: true
}))


app.use(bodyParser.json());
app.use(express.static("assets"));
app.use(express.static("node_modules"));

// * Setup DB
const connectString = process.env.PROD_MONGODB;
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(connectString, {
  useNewUrlParser: true
});

var database;
var db = client.connect().then(db => { });


// * Routes
io.on('connection', function (socket) {
  console.log('a user connected');
});



app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
app.get("/update", (req, res) => res.sendFile(__dirname + "/update.html"));

app.get("/status", (req, res) => {
  database.collection("state").findOne({
    state: Object
  }, (err, result) => {
    res.send(result);
  });
});


// * Update Location
app.post("/update", (req, res) => {

  let data = req.body
  data.date = new Date()

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
  io.emit('locationUpdate', { for: 'everyone' });

});



db.then(success => {
  console.log("connected");
  database = client.db("heroku_wpdrx8dh");
  // app.listen(port, () => console.log(`Example app listening on port ${port}!`));
  http.listen(3000, function () {
    console.log('listening on *:3000');
  });
});
