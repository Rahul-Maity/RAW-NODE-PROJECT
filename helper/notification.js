const https = require('https');
const { twilio } = require('./environt');
const queryString = require(queryString);
//module scaffholding
const notification = {};
notification.sendtwilioSms = (phone, msg, callback) => {
    const userPhone = typeof phone === 'string' && phone.trim().length === 10 ? phone.trim() : false;
    const userMsg = typeof msg === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;
    if (userPhone && userMsg) {
        const payload = {
            From:twilio.fromPhone,
            to: `+91${userPhone}`,
            Body:userMsg
        }
        const stringifyPayload = queryString.stringify(payload);
        //configure the request details
        const requestDetails = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                'Content-type':'application/x-www-from-urlencoded'
            }
        }
        //instanciate the request object
        const req = https.request(requestDetails, (res) => {
            const status = res.statusCode;
            if (status === 200 || status === 201) {
                callback(false);
            }
            else {
                callback(`the status was returned ${status}`);
            }
        });
        req.on('error', (e) => {
            callback(e);
        })
        req.write(stringifyPayload);
        req.end();
    }
    else {
        callback('given parameters are missing or invalid');
    }
    
}

module.exports == notification;