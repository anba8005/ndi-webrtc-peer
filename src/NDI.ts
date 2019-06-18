import { Signaling } from './Signaling';

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
