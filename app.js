var server = require("./server");
var clients = require("./clients");
var rooms = require("./rooms");
require("./routers/users/login");

server.getHttp().listen(80, () => {
  console.log("listening on *:80");
});

server.getApp().use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

server.getApp().post("/", (req, res) => {
  console.log("express");
  res.send(JSON.stringify({ lmao: "lmao" }));
  // let users = req.app.locals.userCollection;
  // users.find({}).toArray((err, user) => {
  //   console.log(user)
  // })
});

server.getIO().on("connection", (client) => {
  clients.addClient(client);
  rooms.sendRooms();

  client.on("createRoom", (data) => {
    rooms.addRoom(client, client.gameData);
  });

  client.on("passGameDate", (gameData) => {
    clients.clientPassGameData(client, gameData);
    clients.clientSendSuccesLogin(client);
  });

  client.on("connectTo", (room_id) => {
    rooms.connectToRoom(room_id, client);
  });

  client.on("turn", (data) => {
    rooms.tryTurn(data, client);
  });

  client.on("disconnect", () => {
    rooms.removeRoomsByDisconnect(client);
    clients.removeClient(client);
    rooms.sendRooms();
  });
});
