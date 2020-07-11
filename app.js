var server = require("./server");
var clients = require("./clients");
var rooms = require("./rooms");

server.getHttp().listen(4000, () => {
  console.log("listening on *:4000");
});

server.getApp().get("/", (req, res) => {
  console.log("express");
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
