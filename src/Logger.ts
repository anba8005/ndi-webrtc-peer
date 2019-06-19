interface LoggerInterface {
	debug: (...args: any[]) => void;
	info: (...args: any[]) => void;
	warn: (...args: any[]) => void;
	error: (...args: any[]) => void;
}

export let logger: LoggerInterface = {
	debug: (...args: any[]) => {
		if (debugEnabled) {
			console.log(args);
		}
	},
	info: (...args: any[]) => {
		console.log(args);
	},
	warn: (...args: any[]) => {
		console.log(args);
	},
	error: (...args: any[]) => {
		console.log(args);
	},
};

export const setLogger = (l: LoggerInterface) => {
	logger = l;
};

const debugEnabled = false;
