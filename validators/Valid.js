exports.validData = (fields, reqBody) => {
  const errors = [];
  //check is field exist
  fields.forEach((field) => {
    if (!reqBody.hasOwnProperty(field)) {
      errors.push({ error: field, type: "missing" });
    }
  });

  if (errors.length > 0) {
    return makeString(errors);
  }

  //check is field non empty
  fields.forEach((field) => {
    if (!reqBody[field].length > 0) {
      errors.push({ error: field, type: "empty" });
    }
  });

  if (errors.length > 0) {
    return makeString(errors);
  }

  return errors;
};

const makeString = (errors) => {
  let error_string = "";
  errors.forEach((error, id) => {
    if (id === 0)
      error_string +=
        error.type === "empty"
          ? `Fill the filed - "${error.error}",`
          : `Cannot found the filed - "${error.error}",`;
    else if (id === errors.length - 1)
      error_string +=
        error.type === "empty"
          ? ` Fill the filed - "${error.error}"`
          : ` Cannot found the filed - "${error.error}"`;
    else
      error_string +=
        error.type === "empty"
          ? ` Fill the filed - "${error.error}",`
          : ` Cannot found the filed - "${error.error}",`;
  });

  return error_string;
};
