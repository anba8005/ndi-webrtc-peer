export declare class RetryWithTimeout {
    private _action;
    private _timeout;
    private _maxRetry;
    private _timer;
    private _count;
    constructor(_action: () => void, _timeout?: number, _maxRetry?: number);
    try(): void;
    reset(): void;
}
