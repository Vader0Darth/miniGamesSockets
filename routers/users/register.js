let server = require("../../server");
let validator = require("../../validators/Valid");
let userValid = require("../../validators/user");
let helpers = require("../../helpers/userHelpers");
const { sendStatusTrue, sendError } = require("../../helpers/responds");

server.getApp().post("/register", (req, res) => {
  let error = validator.validData(userValid.RegisterValidator(), req.body);
  if (error.length > 0) {
    res.send(JSON.stringify({ status: "false", error: error }));
    return;
  }
  registerUser(req).then((data) => {
    if (data === true) sendStatusTrue(res);
    else sendError(res, data);
  });
});

const registerUser = async (req) => {
  let userCollection = req.app.locals.userCollection;
  let error = false;
  let userInserted = false;

  await helpers.findUserByEmail(req.body.email, userCollection).then((data) => {
    if (data) error = data;
  });

  await helpers.findUserByName(req.body.name, userCollection).then((data) => {
    if (data) error = data;
  });

  if (!error)
    await helpers
      .addNewUser(
        req.body.email,
        req.body.password,
        req.body.name,
        userCollection
      )
      .then(() => {
        userInserted = true;
      });
  return userInserted ? userInserted : error;
};
