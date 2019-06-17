"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Signaling_1 = require("./Signaling");
function findNDISources() {
    return __awaiter(this, void 0, void 0, function* () {
        const signaling = new Signaling_1.Signaling();
        signaling.spawn();
        try {
            const sources = yield signaling.request('findNDISources', {});
            return sources;
        }
        catch (e) {
            throw e;
        }
        finally {
            signaling.destroy();
        }
    });
}
exports.findNDISources = findNDISources;
//# sourceMappingURL=NDI.js.map