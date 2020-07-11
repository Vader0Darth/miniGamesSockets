let clients = [];

exports.addClient = (client) => {
  clients.push(client);
};

exports.removeClient = (_client) => {
  clients = clients.filter((client) => client.client.id !== _client.client.id);
};

exports.clientPassGameData = (_client, gameData) => {
  clients.forEach((client) => {
    if (client.client.id === _client.client.id) client.gameData = gameData;
  });
};

exports.clientSendSuccesLogin = (client) => {
  client.emit("succesLogin", { data: true });
};

exports.getClientWithId = (client_id) => {
  let client = clients.filter((client) => client.client.id === client_id);
  if (client.length > 0) return client[0];
};

exports.changeSymbol = (client) => {
  if (client.gameData.symbol === "x") client.gameData.symbol = "o";
  else client.gameData.symbol = "x";
};

exports.showClients = () => {
  console.log(clients);
};

exports.showClientsLength = () => {
  console.log(clients.length);
};
