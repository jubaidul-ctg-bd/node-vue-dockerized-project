const winston = require('winston');
const logger =  winston.createLogger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: 'info-logger.log',
            json: true,
            format: winston.format.combine(winston.format.timestamp(), winston.format.json())
        }),
        new winston.transports.File({
            level: 'error',
            filename: 'error-logger.log',
            json: true,
            format: winston.format.combine(winston.format.timestamp(), winston.format.json())
        })
    ]
})

module.exports = logger