let server = require("../../server");
let validator = require("../../validators/Valid");
let userValid = require("../../validators/user");
let helpers = require("../../helpers/userHelpers");
const { sendStatusTrue, sendError } = require("../../helpers/responds");

server.getApp().post("/login", (req, res) => {
  let err = validator.validData(userValid.LoginValidator(), req.body);
  if (err.length > 0) {
    sendError(res, err);
    return;
  }
  loginUser(req).then((data) => {
    if (data === true) sendStatusTrue(res);
    else sendError(res, data);
  });
});

const loginUser = async (req) => {
  let userCollection = req.app.locals.userCollection;
  let logged = false;
  await helpers
    .findUserWithPass(req.body.email, userCollection, req.body.password)
    .then((data) => {
      if (data) logged = true;
    });
  return logged ? logged : "Verify your email/password";
};
