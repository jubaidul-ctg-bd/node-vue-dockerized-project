const  express 		= require('express');
const bodyParser  	= require('body-parser');
const server 		= express();
const helmet 		= require('helmet');
const cors          = require('cors');
const logger =      require('../config/logger');

server.use(helmet());
server.use(cors());

// parse application/x-www-form-urlencoded 
server.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));

// parse application/json 
server.use(bodyParser.json({limit: '50mb'}));

require('../routes')(server);

server.use((err, req, res, next) => {
    logger.log("error", err.message)
    console.log(err.stack)
})


module.exports = server;

