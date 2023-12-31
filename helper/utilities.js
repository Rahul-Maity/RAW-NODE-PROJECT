
const crypto = require('crypto');
const environment = require("./environt");

const utilities = {};

utilities.parseJson = (jsonString) => {
    let output;
    try {
        output = JSON.parse(jsonString);
    }
    catch {
        output = {}
    }
    return output;
};

utilities.hash = (str) => {
    if (typeof str === 'string' && str.length > 0) {
        console.log(environment, process.env.NODE_ENV);
        const hash = crypto.createHmac('sha256', environment.secretKey).update(str).digest('hex');
        return hash;
    }
    return false;
    
};
utilities.createRandomString = (strlen) => {
   let length = strlen;
    length = typeof length === 'number' && strlen > 0 ? length : false;
   
    if (length) {
        const possibleChar = 'abcdefghijklmnopqrstuvwxyz1234567890';
        let output = '';
        for (let i = 0; i < length; i++) {
            const randomchar = (possibleChar.charAt(Math.floor(Math.random() * possibleChar.length)));
            output += randomchar;
            
        }
        return output;
    }
    return false;
}

module.exports = utilities;