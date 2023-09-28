/*
Title:Uptime monitoring application
Description:A restful api to monitoring up or down time of user - defined links
Author:Rahul Maity
*/

const http=require('http')
const app = {};
app.config = {
    port: 3000,
};
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`listning to the port ${app.config.port}`)
    })
}
app.handleReqRes = (req, res) => {
    res.end('Hello programmers');
}
app.createServer();