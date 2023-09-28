const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes=require('../route')
const notFoundHandler=require('../handler/routesHandler/notFoundHandler')
const handler={}
handler.handleReqRes = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const headersObject = req.headers;
    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headersObject
    };
    const decoder = new StringDecoder('utf-8');
    let realdata = '';
    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;
    chosenHandler(requestProperties, (statusCode, payload) => {
        statusCode = typeof statusCode === 'number' ? statusCode : 500;
        payload = typeof payload === 'object' ? payload : {};

        const payloadString = JSON.stringify(payload);

        // return the final response
        res.writeHead(statusCode);
        res.end(payloadString);
    });
    req.on('data', (buffer) => {
        realdata += decoder.writeHead(buffer);
    });
    req.on('end', () => {
        realdata += decoder.end();
        console.log(realdata);
        res.end('Hello World');
    });


};
module.exports = handler;