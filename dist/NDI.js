"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Signaling_1 = require("./Signaling");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
const os_1 = __importDefault(require("os"));
const tempDirectory = require('temp-dir');
const chmod = util_1.default.promisify(fs_1.default.chmod);
const win32 = os_1.default.platform() === 'win32';
//
//
//
let signaling;
async function findNDISources() {
    if (!signaling) {
        signaling = new Signaling_1.Signaling();
        signaling.spawn();
    }
    //
    try {
        const sources = await signaling.request('findNDISources', {});
        return sources;
    }
    catch (e) {
        shutdownNDISourcesFinder();
        throw e;
    }
}
exports.findNDISources = findNDISources;
function shutdownNDISourcesFinder() {
    if (signaling) {
        try {
            signaling.destroy();
            signaling = undefined;
        }
        catch (err) { }
    }
}
exports.shutdownNDISourcesFinder = shutdownNDISourcesFinder;
//
//
//
async function initializeNativeCode() {
    if (!isNativeCodePackaged()) {
        return false;
    }
    //
    const srcName = getPackagedWorkerName();
    const dstName = getTmpWorkerName();
    //
    await copyFile(srcName, dstName);
    //
    if (win32) {
        // copy aux files
        const srcPath = getPackagedWorkerPath();
        const dstPath = getTmpWorkerPath();
        await copyFile(srcPath + 'avutil-56.dll', dstPath + 'avutil-56.dll');
        await copyFile(srcPath + 'swscale-5.dll', dstPath + 'swscale-5.dll');
        await copyFile(srcPath + 'Processing.NDI.Lib.x64.dll', dstPath + 'Processing.NDI.Lib.x64.dll');
    }
    //
    if (!win32) {
        // chmod +x binary
        await chmod(dstName, 755);
    }
    //
    return true;
}
exports.initializeNativeCode = initializeNativeCode;
function isNativeCodePackaged() {
    // detect if run via pkg (nodejs packager)
    const dir = path_1.default.dirname(require.main.filename);
    if (win32) {
        return dir.indexOf(':\\snapshot\\') > -1;
    }
    else {
        return dir.startsWith('/snapshot/');
    }
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
    return getPackagedWorkerPath() + getExecutableName();
}
exports.getPackagedWorkerName = getPackagedWorkerName;
function getTmpWorkerName() {
    return getTmpWorkerPath() + getExecutableName();
}
exports.getTmpWorkerName = getTmpWorkerName;
function getFFMpegName() {
    return getPackagedWorkerPath() + getFFMpegExecutableName();
}
exports.getFFMpegName = getFFMpegName;
function getExecutableName() {
    return 'ndi-webrtc-peer-worker' + (win32 ? '.exe' : '');
}
function getFFMpegExecutableName() {
    return 'ffmpeg' + (win32 ? '.exe' : '');
}
function getPackagedWorkerPath() {
    let dirname = path_1.default.dirname(require.main.filename);
    //
    if (dirname.indexOf('node_modules' + path_1.default.sep + 'moleculer') > -1) {
        dirname = path_1.default.join(dirname, '..' + path_1.default.sep + '..' + path_1.default.sep + '..');
    }
    else {
        dirname = path_1.default.join(dirname, '..' + path_1.default.sep);
    }
    //
    return path_1.default.join(dirname, 'native' + path_1.default.sep);
}
function getTmpWorkerPath() {
    return tempDirectory + path_1.default.sep;
}
//# sourceMappingURL=NDI.js.map