"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
let logger;
function initLogger() {
    logger = winston_1.createLogger({
        level: 'info',
        format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)),
        transports: [new winston_1.transports.Console()],
    });
}
function setLogger(l) {
    logger = l;
}
exports.setLogger = setLogger;
function getLogger() {
    if (!logger) {
        initLogger();
    }
    return logger;
}
exports.getLogger = getLogger;
//# sourceMappingURL=Logger.js.map