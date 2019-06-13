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
const RTCDataChannel_1 = require("./RTCDataChannel");
const Signaling_1 = require("./Signaling");
const iceConnectionStates = [
    'new',
    'checking',
    'connected',
    'completed',
    'disconnected',
    'failed',
    'closed',
];
const iceGatheringStates = ['new', 'gathering', 'complete'];
const signalingStates = [
    'stable',
    'have-local-offer',
    'have-remote-offer',
    'have-local-pranswer',
    'have-remote-pranswer',
    'closed',
];
class RTCPeerConnection {
    //
    constructor(configuration) {
        this.configuration = configuration;
        this.ssrcs = new Map();
        this.signaling = new Signaling_1.Signaling(this);
        this.signaling.spawn();
        //
        this.created = this.createNativePeer();
    }
    setLocalDescription(desc) {
        return this.request('setLocalDescription', desc).then(() => {
            this.localDescription = desc;
        });
    }
    setRemoteDescription(desc) {
        return this.request('setRemoteDescription', desc).then(() => {
            this.remoteDescription = desc;
        });
    }
    createAnswer(answer) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('createAnswer', answer);
        });
    }
    createOffer(offer) {
        return this.request('createOffer', offer);
    }
    addIceCandidate(candidate) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('addIceCandidate', candidate);
        });
    }
    createDataChannel(name, config) {
        if (!this.channel) {
            this.channel = new RTCDataChannel_1.RTCDataChannel(name, this.signaling);
            this.request('createDataChannel', {
                config,
                name,
            }).catch(e => {
                this.channel._onError(e);
            });
        }
        return this.channel;
    }
    getStats() {
        return this.request('getStats', {});
    }
    addTrack(track) {
        JSON.stringify(track);
        this.request('addTrack', track)
            .then(() => {
            console.log('Track ' + JSON.stringify(track) + ' added');
        })
            .catch(e => {
            if (this.channel) {
                this.channel._onError(e);
            }
            else {
                console.log(e);
            }
        });
        //
        track.replaceTrack = this.replaceTrack.bind(this);
        return track;
    }
    removeTrack(track) {
        this.request('removeTrack', {
            trackId: track.id,
        })
            .then(() => {
            console.log('Track ' + JSON.stringify(track) + ' removed');
        })
            .catch(e => {
            if (this.channel) {
                this.channel._onError(e);
            }
            else {
                console.log(e);
            }
        });
    }
    replaceTrack(newTrack) {
        return this.request('replaceTrack', newTrack)
            .then(() => {
            console.log('Track replaced with ' + JSON.stringify(newTrack));
        })
            .catch(e => {
            if (this.channel) {
                this.channel._onError(e);
            }
            else {
                console.log(e);
            }
        });
    }
    close() {
        console.log('close');
        this.signaling.destroy();
        this.signaling = null;
    }
    //
    _updateIceConnectionState(state) {
        this.iceConnectionState = iceConnectionStates[state];
        if (this.oniceconnectionstatechange) {
            this.oniceconnectionstatechange();
        }
    }
    _updateIceGatheringState(state) {
        this.iceGatheringState = iceGatheringStates[state];
        if (this.onicegatheringstatechange) {
            this.onicegatheringstatechange();
        }
    }
    _updateSignalingState(state) {
        this.signalingState = signalingStates[state];
        if (this.onsignalingstatechange) {
            this.onsignalingstatechange();
        }
    }
    _onDataChannel(name) {
        if (!this.channel) {
            this.channel = new RTCDataChannel_1.RTCDataChannel(name, this.signaling);
            this.ondatachannel({ channel: this.channel });
        }
    }
    _getChannel() {
        return this.channel;
    }
    //
    request(command, payload) {
        return this.created.then(() => {
            return this.signaling.request(command, payload);
        });
    }
    createNativePeer() {
        return this.signaling.request('createPeer', this.configuration);
    }
}
exports.RTCPeerConnection = RTCPeerConnection;
//# sourceMappingURL=RTCPeerConnection.js.map