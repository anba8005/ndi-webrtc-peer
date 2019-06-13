"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Reaction {
    constructor(condition) {
        this.condition = condition;
        this.promiseValue = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
    get promise() {
        return this.promiseValue;
    }
    check(line) {
        if (this.condition(line)) {
            this.resolve();
        }
    }
    cancel() {
        this.reject();
    }
}
exports.Reaction = Reaction;
//# sourceMappingURL=Reaction.js.map