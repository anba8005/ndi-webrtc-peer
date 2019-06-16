import { RTCDataChannel } from './RTCDataChannel';
import { RTCIceCandidate } from './RTCIceCandidate';
import { RTCSessionDescription } from './RTCSessionDescription';
import { Signaling } from './Signaling';
import { NDIMediaTrack } from './NDIMediaTrack';
import { NDIPeerConfiguration } from './NDIPeerConfiguration';
import { RTPSenderInterface, RTPReceiverInterface } from './RTPSenderReceiver';
import { logger } from './Logger';

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

export class RTCPeerConnection {
	public remoteDescription?: RTCSessionDescription;
	public localDescription?: RTCSessionDescription;
	public iceConnectionState: RTCIceConnectionState;
	public iceGatheringState: RTCIceGatheringState;
	public signalingState: RTCSignalingState;

	public oniceconnectionstatechange?: () => void;
	public onicegatheringstatechange?: () => void;
	public onsignalingstatechange?: () => void;

	public onicecandidate?: (event: any) => void;
	public ondatachannel?: (event: any) => void;
	public ontrack?: (event: any) => void;

	//

	private signaling: Signaling;
	private channel?: RTCDataChannel;
	private created: Promise<void>;
	private ssrcs: Map<string, any> = new Map();

	//

	constructor(private configuration: NDIPeerConfiguration) {
		this.signaling = new Signaling(this);
		this.signaling.spawn();
		//
		this.created = this.createNativePeer();
	}

	public setLocalDescription(desc: RTCSessionDescription): Promise<void> {
		return this.request<void>('setLocalDescription', desc).then(() => {
			this.localDescription = desc;
		});
	}

	public setRemoteDescription(desc: RTCSessionDescription): Promise<void> {
		return this.request<void>('setRemoteDescription', desc).then(() => {
			this.remoteDescription = desc;
		});
	}

	public async createAnswer(answer: any): Promise<RTCSessionDescription> {
		return this.request<RTCSessionDescription>('createAnswer', answer);
	}

	public createOffer(offer: any): Promise<RTCSessionDescription> {
		return this.request<RTCSessionDescription>('createOffer', offer);
	}

	public async addIceCandidate(candidate?: RTCIceCandidate): Promise<void> {
		return this.request<void>('addIceCandidate', candidate);
	}

	public createDataChannel(name: string, config: object) {
		if (!this.channel) {
			this.channel = new RTCDataChannel(name, this.signaling);
			this.request<void>('createDataChannel', {
				config,
				name,
			}).catch(e => {
				this.channel._onError(e);
			});
		}
		return this.channel;
	}

	public getStats() {
		// promise api
		return this.request<any>('getStats', {});
	}

	public getStatsOld(cb?: (stats: any) => void, err?: (error: any) => void) {
		// callback api (old)
		this.request<any>('getStatsOld', {})
			.then(stats => {
				cb(stats);
			})
			.catch(error => {
				err(error);
			});
	}

	public getSenders() {
		return this.request<RTPSenderInterface[]>('getSenders', {});
	}

	public getReceivers() {
		return this.request<RTPReceiverInterface[]>('getReceivers', {});
	}

	public addTrack(track: NDIMediaTrack) {
		JSON.stringify(track);
		this.request<void>('addTrack', track)
			.then(() => {
				this.log('Track ' + JSON.stringify(track) + ' added');
			})
			.catch(e => {
				if (this.channel) {
					this.channel._onError(e);
				} else {
					this.log(e);
				}
			});
		//
		track.replaceTrack = this.replaceTrack.bind(this);
		return track;
	}

	public removeTrack(track: NDIMediaTrack) {
		this.request<void>('removeTrack', {
			trackId: track.id,
		})
			.then(() => {
				this.log('Track ' + JSON.stringify(track) + ' removed');
			})
			.catch(e => {
				if (this.channel) {
					this.channel._onError(e);
				} else {
					this.log(e);
				}
			});
	}

	public replaceTrack(newTrack: NDIMediaTrack) {
		return this.request<void>('replaceTrack', newTrack)
			.then(() => {
				this.log('Track replaced with ' + JSON.stringify(newTrack));
			})
			.catch(e => {
				if (this.channel) {
					this.channel._onError(e);
				} else {
					this.log(e);
				}
			});
	}

	public close() {
		this.log('close');
		this.signaling.destroy();
		this.signaling = null;
	}

	//

	public _updateIceConnectionState(state: number) {
		this.iceConnectionState = iceConnectionStates[
			state
		] as RTCIceConnectionState;
		if (this.oniceconnectionstatechange) {
			this.oniceconnectionstatechange();
		}
	}

	public _updateIceGatheringState(state: number) {
		this.iceGatheringState = iceGatheringStates[state] as RTCIceGatheringState;
		if (this.onicegatheringstatechange) {
			this.onicegatheringstatechange();
		}
	}

	public _updateSignalingState(state: number) {
		this.signalingState = signalingStates[state] as RTCSignalingState;
		if (this.onsignalingstatechange) {
			this.onsignalingstatechange();
		}
	}

	public _onDataChannel(name: string) {
		if (!this.channel) {
			this.channel = new RTCDataChannel(name, this.signaling);
			this.ondatachannel({ channel: this.channel });
		}
	}

	public _getChannel() {
		return this.channel;
	}

	//

	private request<T>(command: string, payload: object): Promise<T> {
		return this.created.then(() => {
			return this.signaling.request<T>(command, payload);
		});
	}

	private createNativePeer() {
		return this.signaling.request<void>('createPeer', this.configuration);
	}

	private log(s: any) {
		logger(s);
	}
}
