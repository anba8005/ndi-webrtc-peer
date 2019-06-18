import SimplePeer from 'simple-peer';
import IO from 'socket.io-client';
import { NDIMediaStream } from './NDIMediaStream';
import { NDIMediaTrack } from './NDIMediaTrack';
import { WRTC } from './WRTC';
import { NDIPeerConfiguration } from './NDIPeerConfiguration';
import { findNDISources } from './NDI';

let localId: string = null;
let remoteId: string = null;
let peer: any = null;

let name = 'ANBA8005-DESKTOP (OBS)';
let stream = new NDIMediaStream(
	new NDIMediaTrack(name, true, true, { echoCancelation: false }),
);
const streamTimeout = 5000;

const config: NDIPeerConfiguration = {
	ndi: {
		name: 'TEST',
		persistent: false,
	},
	iceServers: [
		{ urls: 'stun:stun.l.google.com:19302' },
		{ urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
	],
};

findNDISources().then(sources => {
	console.log(sources);
});

function getTestOptions(): any {
	return {
		config,
		answerConstraints: {
			// offerToReceiveVideo: false,
			// offerToReceiveAudio: false,
		},
		offerConstraints: {
			// offerToReceiveVideo: false,
			// offerToReceiveAudio: false,
		},
		initiator: true,
		stream,
		wrtc: WRTC,
	};
}

const io = IO('http://localhost:5000/');
io.on('connect', () => {
	io.emit('emit', 'p2p.join', {
		room: 'test',
	});
});
io.on('p2p.bridged', (bridge: any) => {
	localId = bridge.local;
	remoteId = bridge.remote;
	//
	io.on('p2p.signal', (signal: any) => {
		if (signal.id === remoteId) {
			onSignal(signal.signal);
		}
	});
	//
	io.on('p2p.hangup', () => {
		peer.destroy();
		io.off('p2p.hangup');
		io.off('p2p.signal');
	});

	//
	bridged();
});

function sendSignal(signal: any) {
	// console.log("sending ");
	// console.log(signal);
	io.emit('broadcast', 'p2p.signal', {
		id: localId,
		signal,
	});
}

function bridged() {
	peer = new SimplePeer(getTestOptions());
	peer.on('signal', sendSignal);
	peer.on('error', (e: Error) => {
		console.log('+++++++++++++++++++++peer error -> ');
		console.log(e);
	});
	peer.on('stream', (s: any) => {
		console.log('++++++++++++++++++++++++HAS STREAM');
		// const p = peer as any;
		// p.getStats((err: any, ss: any) => {
		// 	console.log(ss);
		// });
	});
	peer.on('connect', (s: any) => {
		console.log('++++++++++++++++++++++++++=CONNECTED');
		setTimeout(() => {
			const test = {
				test: 'HELLO',
			};
			const p = peer as any;
			p.send(JSON.stringify(test));
			// removeStream();
			// replaceTrack();
			// peer._pc.getSenders().then((s: any) => console.log(s));
			// peer._pc.getReceivers().then((s: any) => console.log(s));
			peer._pc.getStatsOld(
				(stats: any) => {
					console.log(stats);
				},
				(err: any) => {
					console.log('err');
					console.log(err);
				},
			);
		}, 2000);
	});
	peer.on('data', (d: any) => {
		//  console.log(JSON.parse(d));
	});
}

function replaceTrack() {
	if (name === 'ANBA8005-DESKTOP (OBS)') {
		name = 'ANBA8005-DESKTOP (OBS Preview)';
	} else {
		name = 'ANBA8005-DESKTOP (OBS)';
	}
	const newTrack = new NDIMediaTrack(name);
	const p = peer as any;
	p.replaceTrack(stream.getTrack(), newTrack, stream);
	setTimeout(() => {
		replaceTrack();
	}, 5000);
}

function addStream() {
	const p = peer as any;
	stream = new NDIMediaStream(new NDIMediaTrack('ANBA8005-DESKTOP (OBS)'));
	p.addStream(stream);
	setTimeout(() => {
		removeStream();
	}, streamTimeout);
}

function removeStream() {
	const p = peer as any;
	p.removeStream(stream);
	p._needsNegotiation(); // reneg after remove stream
	setTimeout(() => {
		addStream();
	}, streamTimeout);
}

function onSignal(signal: any) {
	// console.log("onSignal");
	// console.log(signal.sdp);
	peer.signal(signal);
}

//
(function wait() {
	setTimeout(wait, 100000);
})();
