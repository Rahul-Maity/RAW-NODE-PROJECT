/*
Title:Uptime monitoring application
Description:A restful api to monitoring up or down time of user - defined links
Author:Rahul Maity
*/

const http = require('http');
const {handleReqRes}=require('./helper/handleReqRes')
const environment = require('./helper/environt');
const data=require('./lib/data')
const app = {};
app.config = {
    port: 3000,
};
//@Todo: delete after
// data.create('test', 'newfile', { 'name': 'India', 'language': 'Benagali' }, (err) => {
//     console.log('err was ', err);
// })
// data.read('test', 'newfile', (err, result) => {
    //     console.log(err, result);
    // })
    // data.update('test', 'newfile', { 'name': 'england', 'language': 'English' }, (err) => {
    //     console.log('err was ', err);
    // })
data.delete('test', 'newfile', (err) => {
    console.log(err);
})
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`listning to the port ${environment.port}`)
    })
}
app.handleReqRes = handleReqRes;
app.createServer();