const express = require("express");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
var bodyParser = require("body-parser");
const adapter = new FileSync("db.json");
const db = low(adapter);
const app = express();

var port = process.env.PORT || 3000;
db.defaults({ status: "" }).write();

app.use(bodyParser.json());

app.use(express.static("assets"));

app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
app.get("/update", (req, res) => res.sendFile(__dirname + "/update.html"));

app.post("/update", (req, res) => {
  //update status in DB
  db.set("status", { lat: req.body.lat, long: req.body.long }).write();

  //log to console
  console.log({ lat: req.body.lat, long: req.body.long });
  //respond to requester
  res.sendStatus(200);
});

app.get("/status", (req, res) => {
  var status = db.get("status").value();
  res.send(status);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
