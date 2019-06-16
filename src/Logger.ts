export let logger = (s: any) => {
	console.log(s);
};

export const setLogger = (l: (s: any) => void) => {
	logger = l;
};
