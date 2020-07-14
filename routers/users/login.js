let server = require("../../server");
let validator = require("../../validators/Valid");
let userValid = require("../../validators/user");
const e = require("express");

server.getApp().post("/login", (req, res) => {
  let err = validator.validData(userValid.LoginValidator(), req.body);
  if (err.length > 0) {
    res.send(JSON.stringify({ status: "false", error: err }));
    return;
  }
  loginUser(req).then((data) => {
    if (data === true) res.send(JSON.stringify({ status: "true" }));
    else res.send(JSON.stringify({ status: "false", error: err }));
  });
});

server.getApp().post("/register", (req, res) => {
  let error = validator.validData(userValid.RegisterValidator(), req.body);
  if (error.length > 0) {
    res.send(JSON.stringify({ status: "false", error: error }));
    return;
  }
  registerUser(req).then((data) => {
    if (data === true) res.send(JSON.stringify({ status: "true" }));
    else res.send(JSON.stringify({ status: "false", error: data }));
  });
});

const registerUser = async (req) => {
  let userCollection = req.app.locals.userCollection;
  let error = false;
  let userInserted = false;

  await findUser(req.body.email, userCollection).then((data) => {
    if (data) {
      error = "userExist";
      return;
    }
  });
  if (!error)
    await insertUser(
      req.body.email,
      req.body.password,
      req.body.name,
      userCollection
    ).then(() => {
      userInserted = true;
    });
  return userInserted ? userInserted : error;
};

const findUser = async (email, userCollection) => {
  let userExist = false;
  await userCollection
    .find({ email: email })
    .toArray()
    .then((data) => {
      if (data.length) userExist = data[0];
    });
  return userExist;
};

const findUserWithPass = async (email, userCollection, password) => {
  let userExist = false;
  await userCollection
    .find({ email: email, password: password })
    .toArray()
    .then((data) => {
      if (data.length) userExist = data[0];
    });
  return userExist;
};

const insertUser = async (email, password, name, userCollection) => {
  let inserted = false;
  await userCollection
    .insertOne({
      email: email,
      name: name,
      password: password,
    })
    .then((data) => {
      inserted = data.insertedCount > 0;
    })
    .catch((err) => console.error(`Failed to insert item: ${err}`));

  return inserted;
};

const loginUser = async (req) => {
  let userCollection = req.app.locals.userCollection;
  let logged = false;
  await findUserWithPass(
    req.body.email,
    userCollection,
    req.body.password
  ).then((data) => {
    if (data) logged = true;
  });
  return logged ? logged : "Verify your email/password";
};
