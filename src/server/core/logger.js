let path = require('path');
let mkdirp = require('mkdirp');
let winston = require('winston');
let Logger = winston.Logger;

let logDir = 'log';

mkdirp.sync(logDir);

module.exports = new Logger({

    transports: [
        new winston.transports.DailyRotateFile({
            filename: path.resolve(logDir, 'minode'),
            datePattern: '.yyyy-MM-dd.log',
            level: 'debug'
        }),
        new winston.transports.Console({
            handleExceptions: true,
            level: 'debug'
        })
    ],

    exceptionHandlers: [
        new winston.transports.DailyRotateFile({
            filename: path.resolve(logDir, 'minode-errors'),
            datePattern: '.yyyy-MM-dd.log',
            level: 'debug'
        })
    ]
});
