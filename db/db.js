var app = require('../app');
const server = require('../server');
var MongoClient = require("mongodb").MongoClient;

const mongoClient = new MongoClient("mongodb://localhost:27017/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoClient.connect(function (err, client) {
  if (err) {
    return console.log(err);
  }
  server.getApp().locals.userCollection = client.db("miniGames_io").collection("users");
  // client.close();
});
