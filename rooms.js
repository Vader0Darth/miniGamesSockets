let server = require("./server");
let clients = require("./clients");
let io = server.getIO();

let rooms = [];

exports.addRoom = (client, clientGameData) => {
  if (!clientHasRoom(client)) {
    rooms.push({
      data: clientGameData,
      owner: client.client.id,
      id: makeId(6),
      visible: true,
    });
    this.sendRooms();
  } else {
    server.sendError("You're already have room", client);
  }
};

exports.removeRoomsByDisconnect = (client) => {
  rooms = rooms.filter((room) => room.owner !== client.client.id);
};

exports.sendRooms = () => {
  let sendRooms = rooms.filter((room) => room.visible === true);
  io.emit("rooms", JSON.stringify(sendRooms));
};

exports.connectToRoom = (room_id, client) => {
  let room = rooms.filter((room) => room.id === room_id.roomId);
  if (room.length > 0) {
    copmareOwnerWithClient(room[0], client)
      ? server.sendError("Это ваша комната", client)
      : connect(room[0], client);
  }
};

exports.tryTurn = (coords, client) => {
  let room = findRoomById(coords.roomId);
  isAviableToTurn(client, room, coords.rid, coords.cid)
    ? turn(room, coords.rid, coords.cid)
    : server.sendError("Что-то пошло не так :(", client);
};

const findRoomById = (roomID) => {
  let room = rooms.filter((room) => room.id === roomID);
  if (room.length > 0) return room[0];
};

const isAviableToTurn = (client, room, rid, cid) => {
  if (client.client.id === room.turn) {
    return room.gameField[rid][cid] === "";
  } else return false;
};

const turn = (room, rid, cid) => {
  room.gameField[rid][cid] = clients.getClientWithId(
    room.turn
  ).gameData.symbol;
  room.turn = room.turn === room.owner ? room.secondPlayer : room.owner;
  
  let onwerClinet = clients.getClientWithId(room.owner);
  let client = clients.getClientWithId(room.secondPlayer);

  onwerClinet.emit("updateRoom", room.gameField);
  client.emit("updateRoom", room.gameField);
};

const connect = (room, client) => {
  roomCreateGameField(room);
  let roomOwner = clients.getClientWithId(room.owner);
  if (client.gameData.symbol === roomOwner.gameData.symbol)
    clients.changeSymbol(client);
  this.removeRoomsByDisconnect(client);
  this.sendRooms();
  room.turn =
    client.gameData.symbol === "x" ? client.client.id : roomOwner.client.id;
  room.secondPlayer = client.client.id;
  client.emit("someOneConnected", {
    enemy: room.data,
    room: {
      gameField: room.gameField,
      data: client.gameData,
      id: room.id,
    },
  });
  ownerMessage = {
    room: room,
    enemy: client.gameData,
  };

  server.sendMessageWithClientId("someOneConnected", ownerMessage, room.owner);
};

const roomCreateGameField = (room) => {
  room.visible = false;
  room.gameField = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
};

const copmareOwnerWithClient = (room, client) => {
  if (room.owner === client.client.id) return true;
  else return false;
};

const clientHasRoom = (client) => {
  let client_room = rooms.filter((room) => room.owner === client.client.id);
  if (client_room.length === 0) return false;
  else return true;
};

const makeId = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
