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
const mac = os_1.default.platform() === 'darwin';
const linux = os_1.default.platform() === 'linux';
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
    await copyFile(srcName, dstName);
    //
    // copy aux files
    const srcPath = getPackagedWorkerPath();
    const dstPath = getTmpWorkerPath();
    await copyFile(srcPath + getFFMpegExecutableName(), dstPath + getFFMpegExecutableName());
    //
    if (win32) {
        await copyFile(srcPath + 'Processing.NDI.Lib.x64.dll', dstPath + 'Processing.NDI.Lib.x64.dll');
    }
    else if (mac) {
        await copyFile(srcPath + 'libndi.4.dylib', dstPath + 'libndi.4.dylib');
    }
    //
    if (mac || linux) {
        await chmod(dstName, 755);
        await chmod(dstPath + getFFMpegExecutableName(), 755);
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
function getPackagedFFMpegName() {
    return getPackagedWorkerPath() + getFFMpegExecutableName();
}
exports.getPackagedFFMpegName = getPackagedFFMpegName;
function getTmpFFMpegName() {
    return getTmpWorkerPath() + getFFMpegExecutableName();
}
exports.getTmpFFMpegName = getTmpFFMpegName;
function getExecutableName() {
    return 'ndi-webrtc-peer-worker' + getExecutableExtension();
}
function getFFMpegExecutableName() {
    return 'ffmpeg' + getExecutableExtension();
}
function getExecutableExtension() {
    if (win32) {
        return '.exe';
    }
    else if (mac) {
        return '.mac';
    }
    else if (linux) {
        return '.linux';
    }
    else {
        throw new Error('Invalid architecture ' + os_1.default.platform);
    }
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