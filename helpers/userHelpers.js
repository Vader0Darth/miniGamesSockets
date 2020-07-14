exports.findUserByEmail = async (email, userCollection) => {
  let user = false;
  await userCollection
    .find({ email: email })
    .toArray()
    .then((data) => {
      if (data.length) user = "Email already exist";
    });
  return user;
};

exports.findUserByName = async (name, userCollection) => {
  let user = false;
  await userCollection
    .find({ name: name })
    .toArray()
    .then((data) => {
      if (data.length) user = "Name already exist";
    });
  return user;
};

exports.addNewUser = async (email, password, name, userCollection) => {
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

exports.findUserWithPass = async (email, userCollection, password) => {
  let user = false;
  await userCollection
    .find({ email: email, password: password })
    .toArray()
    .then((data) => {
      if (data.length) user = data[0];
    });
  return user;
};
