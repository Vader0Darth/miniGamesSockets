var app = require("express")();
var cors = require("cors");

app.use(cors());

var http = require("http").createServer(app);
var io = require("socket.io")(http);

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var clients = require("./clients");

require("./db/db");

exports.getIO = () => {
  return io;
};

exports.getHttp = () => {
  return http;
};

exports.getApp = () => {
  return app;
};

exports.sendError = (error, client) => {
  client.emit("Error", error);
};

exports.sendMessageWithClientId = (messageName, message, client_id) => {
  let client = clients.getClientWithId(client_id);
  if (client) client.emit(messageName, message);
};
