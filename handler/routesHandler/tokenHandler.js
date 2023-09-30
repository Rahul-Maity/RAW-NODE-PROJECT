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
 
};
handler._tokens.put = (requestProperties, callback) => {
  
};

handler._tokens.delete=(requestProperties, callback)=>{
   
};

module.exports = handler;
