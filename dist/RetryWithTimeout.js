"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RetryWithTimeout {
    constructor(_action, _timeout = 1000, _maxRetry = 5) {
        this._action = _action;
        this._timeout = _timeout;
        this._maxRetry = _maxRetry;
        this._count = 0;
    }
    try() {
        if (this._count < this._maxRetry) {
            clearTimeout(this._timer);
            this._timer = setTimeout(() => {
                this._count++;
                this._action();
            }, this._timeout);
        }
    }
    reset() {
        clearTimeout(this._timer);
        this._count = 0;
    }
}
exports.RetryWithTimeout = RetryWithTimeout;
//# sourceMappingURL=RetryWithTimeout.js.map