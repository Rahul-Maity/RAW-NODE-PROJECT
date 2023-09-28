const handler={}
handler.notFoundHandler = (requestProperties, callback) => {
    console.log(requestProperties);
    callback(400, {
        message: 'not found anything'
    });
}
module.exports = handler;