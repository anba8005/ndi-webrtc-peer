"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const simple_peer_1 = __importDefault(require("simple-peer"));
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const NDIMediaStream_1 = require("./NDIMediaStream");
const NDIMediaTrack_1 = require("./NDIMediaTrack");
const WRTC_1 = require("./WRTC");
let localId = null;
let remoteId = null;
let peer = null;
let name = 'ANBA8005-DESKTOP (OBS)';
let stream = new NDIMediaStream_1.NDIMediaStream(new NDIMediaTrack_1.NDIMediaTrack(name, true, true, { echoCancellation: false }, true, 640, 360));
const streamTimeout = 5000;
const config = {
    ndi: {
        name: 'TEST',
    },
    preview: {
        videoUrl: 'rtp://127.0.0.1:50505',
        audioUrl: 'rtp://127.0.0.1:50510',
    },
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
    ],
};
// findNDISources().then(sources => {
// 	console.log(sources);
// });
// findNDISources().then(sources => {
// 	console.log(sources);
// });
function getTestOptions() {
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
        initiator: false,
        // stream,
        wrtc: WRTC_1.WRTC,
    };
}
const io = socket_io_client_1.default('wss://backend.gyvaitv.lt');
io.on('connect', () => {
    io.emit('emit', 'p2p.join', {
        room: 'test',
    });
});
io.on('p2p.bridged', (bridge) => {
    localId = bridge.local;
    remoteId = bridge.remote;
    //
    io.on('p2p.signal', (signal) => {
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
function sendSignal(signal) {
    // console.log("sending ");
    // console.log(signal);
    io.emit('broadcast', 'p2p.signal', {
        id: localId,
        signal,
    });
}
function bridged() {
    peer = new simple_peer_1.default(getTestOptions());
    peer.on('signal', sendSignal);
    peer.on('error', (e) => {
        console.log('+++++++++++++++++++++peer error -> ');
        console.log(e);
    });
    peer.on('stream', (s) => {
        console.log('++++++++++++++++++++++++HAS STREAM');
        // const p = peer as any;
        // p.getStats((err: any, ss: any) => {
        // 	console.log(ss);
        // });
    });
    peer.on('connect', (s) => {
        console.log('++++++++++++++++++++++++++=CONNECTED');
        // setTimeout(() => {
        // 	const test = {
        // 		test: 'HELLO',
        // 	};
        // 	const p = peer as any;
        // 	p.send(JSON.stringify(test));
        // 	// removeStream();
        // 	// replaceTrack();
        // 	// peer._pc.getSenders().then((s: any) => console.log(s));
        // 	// peer._pc.getReceivers().then((s: any) => console.log(s));
        // 	peer._pc.getStatsOld(
        // 		(stats: any) => {
        // 			console.log(stats);
        // 		},
        // 		(err: any) => {
        // 			console.log('err');
        // 			console.log(err);
        // 		},
        // 	);
        // }, 2000);
    });
    peer.on('data', (d) => {
        //  console.log(JSON.parse(d));
    });
}
function replaceTrack() {
    if (name === 'ANBA8005-DESKTOP (OBS)') {
        name = 'ANBA8005-DESKTOP (OBS Preview)';
    }
    else {
        name = 'ANBA8005-DESKTOP (OBS)';
    }
    const newTrack = new NDIMediaTrack_1.NDIMediaTrack(name);
    const p = peer;
    p.replaceTrack(stream.getTrack(), newTrack, stream);
    setTimeout(() => {
        replaceTrack();
    }, 5000);
}
function addStream() {
    const p = peer;
    stream = new NDIMediaStream_1.NDIMediaStream(new NDIMediaTrack_1.NDIMediaTrack('ANBA8005-DESKTOP (OBS)'));
    p.addStream(stream);
    setTimeout(() => {
        removeStream();
    }, streamTimeout);
}
function removeStream() {
    const p = peer;
    p.removeStream(stream);
    p._needsNegotiation(); // reneg after remove stream
    setTimeout(() => {
        addStream();
    }, streamTimeout);
}
function onSignal(signal) {
    // console.log("onSignal");
    // console.log(signal.sdp);
    peer.signal(signal);
}
//
(function wait() {
    setTimeout(wait, 100000);
})();
//# sourceMappingURL=example.js.map