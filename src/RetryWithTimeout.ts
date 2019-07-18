export class RetryWithTimeout {
	private _timer: any;
	private _count: number = 0;

	constructor(
		private _action: () => void,
		private _timeout: number = 1000,
		private _maxRetry: number = 5,
	) {}

	public try() {
		if (this._count < this._maxRetry) {
			clearTimeout(this._timer);
			this._timer = setTimeout(() => {
				this._count++;
				this._action();
			}, this._timeout);
		}
	}

	public reset() {
		clearTimeout(this._timer);
		this._count = 0;
	}
}
