const { parseJson, createRandomString } = require("../../helper/utilities");
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

handler._checks.get = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;
  if (id) {
    data.read("checks", id, (err1, checkData) => {
      if (!err1 && checkData) {
        const token =
          typeof requestProperties.headersObject.token === "string" &&
          requestProperties.headersObject.token.trim().length === 20
            ? requestProperties.headersObject.token
            : false;
        tokenHandler._tokens.verify(
          token,
          parseJson(checkData).userPhone,
          (istokenValid) => {
            if (istokenValid) {
              callback(200, parseJson(checkData));
            } else {
              callback(403, {
                error: "Authentication error",
              });
            }
          }
        );
      } else {
        callback(500, {
          error: "You have a problem in your request",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};
handler._checks.put = (requestProperties, callback) => {
    const id =
    typeof requestProperties.body.id === 'string' &&
    requestProperties.body.id.trim().length === 20
        ? requestProperties.body.id
        : false;
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
    if (id) {
        if (protocol || url || method || successcodes || timeoutseconds) {
            data.read('checks', id, (err1, checkData) => {
                if (!err1 && checkData) {
                    const checkObject = parseJson(checkData);
                    const token =
          typeof requestProperties.headersObject.token === "string" &&
          requestProperties.headersObject.token.trim().length === 20
            ? requestProperties.headersObject.token
                            : false;
                    console.log(token);
                    console.log(checkObject.userPhone);
                    tokenHandler._tokens.verify(token, checkObject.userPhone, (tokenIsValid) => {
                        if (tokenIsValid) {
                            if (protocol) {
                                checkObject.protocol = protocol;
                            }
                            if (url) {
                                checkObject.url = url;
                            }
                            if (method) {
                                checkObject.method = method;
                            }
                            if (successcodes) {
                                checkObject.successcodes = successcodes;
                            }
                            if (timeoutseconds) {
                                checkObject.timeoutsecondsl = timeoutseconds;
                            }
                            data.update('checks', id, checkObject, (err2) => {
                                if (!err2) {
                                    callback(200, checkObject);
                                }
                                else {
                                    callback(500, {
                                        error: "There was a problem updating",
                                    });
                                }
                            });
                        }
                        else {
                            callback(403, {
                                error: "Authentication error",
                            });
                        }
                    });
                }
                else {
                    callback(500, {
                        error: "There was a problem server side",
                    });
                }
            });
        }
        else {
            callback(400, {
                error: "You must provide atleast one field to update",
              });
        }
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};

handler._checks.delete = (requestProperties, callback) => {
  const id = requestProperties.queryStringObject.id === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;
  if (id) {
    data.read('checks', id, (err1, checkData) => {
      if (!err1 && checkData) {
        const token = typeof requestProperties.headersObject.token === 'string' ? requestProperties.headersObject.token : false;
        tokenHandler._tokens.verify(token, parseJson(checkData).userPhone, (isTokenvalid) => {
          if (isTokenvalid) {
            data.delete('checks', id, (err2) => {
              if (!err2) {
                data.read('users', parseJson(checkData).userPhone, (err3, userData) => {
                  const userObject = parseJson(userData);
                  if (!err3 && userData) {
                    const userChecks = typeof userObject.checks === 'object' && userObject.checks instanceof Array ? userObject.checks : [];
                    const checkPosition = userChecks.indexOf(id);
                    if (checkPosition > -1) {
                      userChecks.splice(checkPosition, 1);
                      userObject.checks = userChecks;
                      data.update('users', userObject.phone, userObject, (err4) => {
                        if (!err4) {
                          callback(200);
                        }
                        else {
                          callback(500, {
                            'error': 'there was a server side problem',
                          });
                        }
                      });
                    }
                    else {
                      callback(500, {
                        'error': 'The check id you want to remove is not found',
                      });
                    }
                  }
                  else {
                    callback(500, {
                      'error': 'There was a problem server side'
                    });
                  }
                });
              }
              else {
                callback(500, {
                  'error': 'There was a problem server side'
                });
              }
            });
          }
          else {
            callback(403, {
              'error': 'Authentication faliure'
            });
          }
        });
      
      }
      else {
        callback(500, {
          'error': 'You have a problem in your req'
        });
      }
    });
  }
  else {
    callback(400, {
      'error': 'There was a problem server side'
    });
  }
};

module.exports = handler;
