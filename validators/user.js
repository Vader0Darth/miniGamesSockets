exports.LoginValidator = () => {
  return ["email", "password"];
};

exports.RegisterValidator = () => {
  return ["email", "password", "name"];
};
