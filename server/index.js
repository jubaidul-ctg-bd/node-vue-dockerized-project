const   config = require('config-yml'),
        server = require('./server');

const logger =      require('./config/logger');


server.listen(config.port);
console.log('Server is listening on port:' + config.port);
logger.log("info", `Server is listening on port: ${config.port}`)

require('./server/socket')(server)

server.on('error', err => {
    console.error(err);
});