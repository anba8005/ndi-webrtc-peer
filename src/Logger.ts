import { createLogger, format, transports, Logger } from 'winston';

let logger: Logger;

function initLogger() {
	logger = createLogger({
		level: 'info',
		format: format.combine(
			format.colorize(),
			format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
			format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
		),
		transports: [new transports.Console()],
	});
}

export function setLogger(l: Logger) {
	logger = l;
}

export function getLogger() {
	if (!logger) {
		initLogger();
	}
	return logger;
}
