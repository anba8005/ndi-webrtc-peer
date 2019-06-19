interface LoggerInterface {
	debug: (...args: any[]) => void;
	info: (...args: any[]) => void;
	warn: (...args: any[]) => void;
	error: (...args: any[]) => void;
}

export let ndiLogger: LoggerInterface = {
	debug: (...args: any[]) => {
		if (debugEnabled) {
			console.log(...args);
		}
	},
	info: (...args: any[]) => {
		console.log(...args);
	},
	warn: (...args: any[]) => {
		console.log(...args);
	},
	error: (...args: any[]) => {
		console.log(...args);
	},
};

export const setNDILogger = (l: LoggerInterface) => {
	ndiLogger = l;
};

const debugEnabled = false;
