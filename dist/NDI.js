"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Signaling_1 = require("./Signaling");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const tempDirectory = require('temp-dir');
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
function initializeNativeCode() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!isNativeCodePackaged()) {
            return false;
        }
        //
        const srcName = getPackagedWorkerName();
        const dstName = getTmpWorkerName();
        //
        yield copyFile(srcName, dstName);
        //
        fs_1.default.chmodSync(dstName, 755);
        //
        return true;
    });
}
exports.initializeNativeCode = initializeNativeCode;
function isNativeCodePackaged() {
    // detect if run via pkg (nodejs packager)
    return path_1.default.dirname(require.main.filename).startsWith('/snapshot/');
}
exports.isNativeCodePackaged = isNativeCodePackaged;
function copyFile(source, target) {
    return new Promise((resolve, reject) => {
        const rd = fs_1.default.createReadStream(source);
        rd.on('error', err => reject(err));
        const wr = fs_1.default.createWriteStream(target);
        wr.on('error', err => reject(err));
        wr.on('close', () => resolve());
        rd.pipe(wr);
    });
}
function getPackagedWorkerName() {
    return path_1.default.join(path_1.default.dirname(require.main.filename), '../native/ndi-webrtc-peer-worker');
}
exports.getPackagedWorkerName = getPackagedWorkerName;
function getTmpWorkerName() {
    return tempDirectory + path_1.default.sep + 'ndi-webrtc-peer-worker';
}
exports.getTmpWorkerName = getTmpWorkerName;
//# sourceMappingURL=NDI.js.map