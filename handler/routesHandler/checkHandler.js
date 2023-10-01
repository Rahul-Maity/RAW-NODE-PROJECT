const {

  parseJson,
  createRandomString,
} = require("../../helper/utilities");
const data = require("../../lib/data");
const tokenHandler = require("./tokenHandler");
const handler = {};
const { maxchecks } = require("../../helper/environt");

handler.checkHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "put", "post", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    console.log(requestProperties.method);
    handler._checks[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};
handler._checks = {};
handler._checks.post = (requestProperties, callback) => {
  const protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;
  const url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;
  const method =
    typeof requestProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;
  const successcodes =
    typeof requestProperties.body.successcodes === "object" &&
    requestProperties.body.successcodes instanceof Array
      ? requestProperties.body.successcodes
      : false;
  const timeoutseconds =
    typeof requestProperties.body.timeoutseconds === "number" &&
    requestProperties.body.timeoutseconds % 1 === 0 &&
    requestProperties.body.timeoutseconds >= 1 &&
    requestProperties.body.timeoutseconds <= 5
      ? requestProperties.body.timeoutseconds
      : false;
  if ((protocol, url, method, successcodes, timeoutseconds)) {
    const token =
      typeof requestProperties.headersObject.token === "string" &&
      requestProperties.headersObject.token.trim().length === 20
        ? requestProperties.headersObject.token
        : false;
    data.read("tokens", token, (err1, tokenData) => {
      if (!err1 && tokenData) {
          const userPhone = parseJson(tokenData).phone;
       
        data.read("users", userPhone, (err2, userData) => {
          if (!err2 && userData) {
            tokenHandler._tokens.verify(token, userPhone, (tokenIsvalid) => {
              if (tokenIsvalid) {
                  const userObject = parseJson(userData);
                 
                const userChecks =
                  typeof userObject.checks === "object" &&
                  userObject.checks instanceof Array
                    ? userObject.checks
                    : [];
                if (userChecks.length < maxchecks) {
                  const checkId = createRandomString(20);
                  const checkObject = {
                    id: checkId,
                    userPhone,
                    protocol,
                    url,
                    method,
                    successcodes,
                    timeoutseconds,
                  };
                  data.create("checks", checkId, checkObject, (err3) => {
                    if (!err3) {
                      userObject.checks = userChecks;
                      userObject.checks.push(checkId);
                      data.update("users", userPhone, userObject, (err4) => {
                        if (!err4) {
                          callback(200, checkObject);
                        } else {
                          callback(500, {
                            error: "There was a updating",
                          });
                        }
                      });
                    } else {
                      callback(500, {
                        error: "There was a problem in server side",
                      });
                    }
                  });
                } else {
                  callback(401, {
                    error: "User already reached maximum checks",
                  });
                }
              } else {
                callback(403, {
                  error: "Authentication problem",
                });
              }
            });
          } else {
            callback(403, {
              error: "User not found",
            });
          }
        });
      } else {
        callback(403, {
          error: "Authentication error",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};

handler._checks.get = (requestProperties, callback) => {};
handler._checks.put = (requestProperties, callback) => {};

handler._checks.delete = (requestProperties, callback) => {};

module.exports = handler;
