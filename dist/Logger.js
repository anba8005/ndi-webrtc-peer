"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = {
    debug: (...args) => {
        if (debugEnabled) {
            console.log(args);
        }
    },
    info: (...args) => {
        console.log(args);
    },
    warn: (...args) => {
        console.log(args);
    },
    error: (...args) => {
        console.log(args);
    },
};
exports.setLogger = (l) => {
    exports.logger = l;
};
const debugEnabled = false;
//# sourceMappingURL=Logger.js.map