"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ndiLogger = {
    debug: (...args) => {
        if (debugEnabled) {
            console.log(...args);
        }
    },
    info: (...args) => {
        console.log(...args);
    },
    warn: (...args) => {
        console.log(...args);
    },
    error: (...args) => {
        console.log(...args);
    },
};
exports.setNDILogger = (l) => {
    exports.ndiLogger = l;
};
const debugEnabled = false;
//# sourceMappingURL=Logger.js.map