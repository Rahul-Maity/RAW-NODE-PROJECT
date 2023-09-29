const { hash, parseJson } = require("../../helper/utilities");
const data = require("../../lib/data");

const handler = {};

handler.userHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "put", "post", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    console.log(requestProperties.method);
    handler._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};
handler._users = {};
handler._users.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;
  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;
  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password
      ? requestProperties.body.password
      : false;
  const toAgreement =
    typeof requestProperties.body.toAgreement === "boolean" &&
    requestProperties.body.toAgreement
      ? requestProperties.body.toAgreement
      : false;
  // console.log(firstName,
  //     lastName,
  //     phone,
  //     password,
  //     toAgreement);
  if (firstName && lastName && phone && password && toAgreement) {
    data.read("users", phone, (err1) => {
      if (err1) {
        const userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          toAgreement,
        };
        //store information to the db
        data.create("users", phone, userObject, (err2) => {
          if (!err2) {
            callback(200, {
              message: "user was created successfully",
            });
          } else {
            callback(500, {
              error: "couldnot create user",
            });
          }
        });
      } else {
        callback(500, {
          error: "There was a problem at server side",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};

handler._users.get = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    data.read("users", phone, (err, u) => {
      const user = { ...parseJson(u) }; //immutable copy
      if (!err && user) {
        delete user.password;
        callback(200, user);
      } else {
        callback(404, {
          error: "requested user was not found",
        });
      }
    });
  } else {
    callback(404, {
      error: "requested user was not found",
    });
  }
};
handler._users.put = (requestProperties, callback) => {
  // check the phone number if valid
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  if (phone) {
    if (firstName || lastName || password) {
      // loopkup the user
      data.read("users", phone, (err1, uData) => {
        const userData = { ...parseJson(uData) };

        if (!err1 && userData) {
          if (firstName) {
            userData.firstName = firstName;
          }
          if (lastName) {
            userData.firstName = firstName;
          }
          if (password) {
            userData.password = hash(password);
          }

          // store to database
          data.update("users", phone, userData, (err2) => {
            if (!err2) {
              callback(200, {
                message: "User was updated successfully!",
              });
            } else {
              callback(500, {
                error: "There was a problem in the server side!",
              });
            }
          });
        } else {
          callback(400, {
            error: "You have a problem in your request!",
          });
        }
      });
    } else {
      callback(400, {
        error: "You have a problem in your request!",
      });
    }
  } else {
    callback(400, {
      error: "Invalid phone number. Please try again!",
    });
  }
};

handler._users.delete=(requestProperties, callback)=>{
    const phone =
    typeof requestProperties.queryStringObject.phone === 'string' &&
    requestProperties.queryStringObject.phone.trim().length === 11
        ? requestProperties.queryStringObject.phone
        : false;
    if (phone) {
        data.read('users', phone, (err1, userData) => {
            if (!err1 && userData) {
                data.delete('users', phone, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: 'deleted successfully'
                        });
                    }
                    else {
                        callback(500, {
                            error: 'There was a server side error'
                        });
                    }
                });
            }
            else {
                callback(500, {
                    error: 'There was a server side error'
                });
            }
        });
    }
    else {
        callback(400, {
            error: 'There was a problem iin your request'
        });
    }
};

module.exports = handler;
