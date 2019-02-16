export interface NDIPeerConfiguration extends RTCConfiguration {
	ndi: {
		name: string;
		width?: number;
		height?: number;
		frameRate?: number;
		persistent?: boolean;
	};
	cpuAdaptation?: boolean;
}

export function createDefaultConfiguration(): NDIPeerConfiguration {
	return {
		ndi: {
			name: 'TEST',
			persistent: false,
		},
		iceServers: [
			{ urls: 'stun:stun.l.google.com:19302' },
			{ urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
		],
	};
}
