export class Reaction {

	private promiseValue: Promise<void>;
	private resolve: any;
	private reject: any;

	constructor(private condition: (line: string) => boolean) {
		this.promiseValue = new Promise<void>((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}

	public get promise() {
		return this.promiseValue;
	}

	public check(line: string) {
		if (this.condition(line)) {
			this.resolve();
		}
	}

	public cancel() {
		this.reject();
	}
}
