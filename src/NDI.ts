import { Signaling } from './Signaling';
import path from 'path';
import fs from 'fs';
import util from 'util';

const tempDirectory = require('temp-dir');

const chmod = util.promisify(fs.chmod);

export interface NDISource {
	name: string;
	ip: string;
}

export async function findNDISources() {
	const signaling = new Signaling();
	signaling.spawn();
	try {
		const sources = await signaling.request<NDISource[]>('findNDISources', {});
		return sources;
	} catch (e) {
		throw e;
	} finally {
		signaling.destroy();
	}
}

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
	await chmod(dstName, 755);
	//
	return true;
}

export function isNativeCodePackaged() {
	// detect if run via pkg (nodejs packager)
	return path.dirname(require.main.filename).startsWith('/snapshot/');
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
	return path.join(
		path.dirname(require.main.filename),
		'../native/ndi-webrtc-peer-worker',
	);
}

export function getTmpWorkerName() {
	return tempDirectory + path.sep + 'ndi-webrtc-peer-worker';
}
