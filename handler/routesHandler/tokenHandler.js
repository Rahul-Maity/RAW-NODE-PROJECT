const { hash, parseJson, createRandomString } = require("../../helper/utilities");
const data = require("../../lib/data");

const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "put", "post", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    console.log(requestProperties.method);
    handler._tokens[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};
handler._tokens = {};
handler._tokens.post = (requestProperties, callback) => {
    const phone = typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
    const password = typeof requestProperties.body.password === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
    if (phone && password) {
        data.read('users', phone, (err1, userData) => {
            const hashedPassword = hash(password);
            if (hashedPassword === parseJson(userData).password) {
                const tokenId = createRandomString(20);
                const expires = Date.now() + 60 * 60 * 1000;
                const tokenObject = {
                    id: tokenId,
                    phone,
                    expires
                }
                data.create('tokens', tokenId, tokenObject, (err2) => {
                    if (!err2) {
                        callback(200, tokenObject);
                    }
                    else {
                        callback(500, {
                            error:'problem while storing'
                        })
                    }
                })
            }
            else {
                callback(400, {
                    error:'wrong password'
                })
            }
        })
    }
    else {
        callback(400, {
            error:'There was a problem in your request'
        })
    }
};

handler._tokens.get = (requestProperties, callback) => {
    const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    data.read("tokens", id, (err, tokenData) => {
      const token = { ...parseJson(tokenData) }; //immutable copy
      if (!err && token) {
     
        callback(200, token);
      } else {
        callback(404, {
          error: "requested token was not found",
        });
      }
    });
  } else {
    callback(404, {
      error: "requested token was not found",
    });
  }
};
handler._tokens.put = (requestProperties, callback) => {
    const id =
    typeof requestProperties.body.id === 'string' &&
    requestProperties.body.id.trim().length === 20
        ? requestProperties.body.id
        : false;
    const extend = !!(
        typeof requestProperties.body.extend === 'boolean' && requestProperties.body.extend === true
    );
    if (id && extend) {
        data.read('tokens', id, (err1, tokenData) => {
            const tokenObject = parseJson(tokenData);
            if (tokenObject.expires > Date.now()) {
                tokenObject.expires = Date.now() + 60 * 60 * 1000;
                data.update('tokens', id, tokenObject, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: 'extends successfully'
                        });
                    }
                    else {
                        callback(500, {
                            error: 'There was a problem server side'
                        });
                    }
                });
            }
            else {
                callback(400, {
                    error: 'token already expired'
                });
            }
            
        });
    }
    else {
        callback(400, {
            error: 'there was a problem in your request'
        });
    }
};

handler._tokens.delete=(requestProperties, callback)=>{
    const id =
    typeof requestProperties.queryStringObject.id === 'string' &&
    requestProperties.queryStringObject.id.trim().length === 20
        ? requestProperties.queryStringObject.id
        : false;
    if (id) {
        data.read('tokens', id, (err1, tokenData) => {
            if (!err1 && tokenData) {
                data.delete('tokens', id, (err2) => {
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

handler._tokens.verify = (id, phone, callback) => {
    data.read('tokens', id, (err1, tokenData) => {
        if (!err1 && tokenData) {
            if (parseJson(tokenData).phone === phone && parseJson(tokenData).expires > Date.now()) {
                callback(true);
            }
            else {
                callback(false);
            }
        }
        else {
            callback(false);
        }
    })
}

module.exports = handler;
