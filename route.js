const {sampleHandler}=require('./handler/routesHandler/sampleHandler');
const { tokenHandler } = require('./handler/routesHandler/tokenHandler');
const {userHandler } = require('./handler/routesHandler/userHandler');

const routes = {
    sample: sampleHandler,
    user: userHandler,
    token:tokenHandler
}
module.exports = routes;


