import { Signaling } from './Signaling';
import path from 'path';
import fs from 'fs';
import util from 'util';
import os from 'os';

const tempDirectory = require('temp-dir');

const chmod = util.promisify(fs.chmod);

const win32 = os.platform() === 'win32';

//
//
//

let signaling: Signaling;

export interface NDISource {
	name: string;
	ip: string;
}

export async function findNDISources() {
	if (!signaling) {
		signaling = new Signaling();
		signaling.spawn();
	}
	//
	try {
		const sources = await signaling.request<NDISource[]>('findNDISources', {});
		return sources;
	} catch (e) {
		shutdownNDISourcesFinder();
		throw e;
	}
}

export function shutdownNDISourcesFinder() {
	if (signaling) {
		try {
			signaling.destroy();
			signaling = undefined;
		} catch (err) {}
	}
}

//
//
//

export async function initializeNativeCode() {
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
		await copyFile(
			srcPath + 'Processing.NDI.Lib.x64.dll',
			dstPath + 'Processing.NDI.Lib.x64.dll',
		);
	}
	//
	if (!win32) {
		// chmod +x binary
		await chmod(dstName, 755);
	}
	//
	return true;
}

export function isNativeCodePackaged() {
	// detect if run via pkg (nodejs packager)
	const dir = path.dirname(require.main.filename);
	if (win32) {
		return dir.indexOf(':\\snapshot\\') > -1;
	} else {
		return dir.startsWith('/snapshot/');
	}
}

function copyFile(source: string, target: string) {
	return new Promise((resolve, reject) => {
		const rd = fs.createReadStream(source);
		rd.on('error', err => reject(err));
		const wr = fs.createWriteStream(target);
		wr.on('error', err => reject(err));
		wr.on('close', () => resolve());
		rd.pipe(wr);
	});
}

export function getPackagedWorkerName() {
	return getPackagedWorkerPath() + getExecutableName();
}

export function getTmpWorkerName() {
	return getTmpWorkerPath() + getExecutableName();
}

function getExecutableName() {
	return 'ndi-webrtc-peer-worker' + (win32 ? '.exe' : '');
}

function getPackagedWorkerPath() {
	return path.join(
		path.dirname(require.main.filename),
		'..' + path.sep + 'native' + path.sep,
	);
}

function getTmpWorkerPath() {
	return tempDirectory + path.sep;
}
