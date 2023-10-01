const { checkHandler } = require('./handler/routesHandler/checkHandler');
const {sampleHandler}=require('./handler/routesHandler/sampleHandler');
const { tokenHandler } = require('./handler/routesHandler/tokenHandler');
const {userHandler } = require('./handler/routesHandler/userHandler');

const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler,
    check:checkHandler
}
module.exports = routes;


