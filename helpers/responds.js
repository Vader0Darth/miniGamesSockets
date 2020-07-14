exports.sendStatusTrue = (res) => {
  res.send(JSON.stringify({ status: "true" }));
};

exports.sendError = (res, error) => {
  res.send(JSON.stringify({ status: "false", error: error }));
};
