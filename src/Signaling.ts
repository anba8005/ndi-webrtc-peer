import { ChildProcess, spawn } from 'child_process';
import { createInterface, ReadLine } from 'readline';
import { RTCPeerConnection } from './RTCPeerConnection';
import { ndiLogger } from './Logger';
import os from 'os';
import {
	isNativeCodePackaged,
	getPackagedWorkerName,
	getTmpWorkerName,
} from './NDI';

interface IRequest {
	command: string;
	correlation: number;
	payload: object;
}

interface IState {
	command: string;
	payload?: object;
}

interface IReply extends IState {
	correlation: number;
	ok?: boolean;
	error?: string;
}

interface IResolution {
	resolve: any;
	reject: any;
}

export class Signaling {
	private process: ChildProcess;
	private reader: ReadLine;

	private lastCorrelation: number = 0;
	private resolutions: Map<number, IResolution> = new Map();

	private destroyed: boolean = false;

	constructor(private peer?: RTCPeerConnection) {}

	public spawn() {
		const workerName = isNativeCodePackaged()
			? getTmpWorkerName()
			: getPackagedWorkerName();
		ndiLogger.info('Starting ' + workerName);
		this.process = spawn(workerName, this.createArguments());
		this.process.on('exit', (code, signal) => this.onProcessExit(code, signal));
		//
		this.process.stderr.setEncoding('utf-8');
		this.process.stdout.setEncoding('utf-8');
		this.process.stdin.setDefaultEncoding('utf-8');
		//
		this.process.stderr.on('data', data => this.onProcessStdErr(data));
		this.reader = createInterface({
			input: this.process.stdout,
			output: null,
			terminal: false,
		});
		this.reader.on('line', line => this.onProcessLine(line));
	}

	public get isDestroyed() {
		return this.destroyed;
	}

	public destroy() {
		try {
			this.destroyed = true;
			this.reader.close();
			this.writeLine('STOP');
		} catch (e) {}
	}

	public request<T>(command: string, payload: object): Promise<T> {
		const promise = new Promise<T>((resolve, reject) => {
			this.lastCorrelation++;
			const correlation = this.lastCorrelation;
			//
			const json: IRequest = { command, payload, correlation };
			this.writeLine(JSON.stringify(json));
			//
			const resolution: IResolution = { reject, resolve };
			this.resolutions.set(correlation, resolution);
		});
		return promise;
	}

	//
	//
	//

	private onProcessLine(line: string) {
		ndiLogger.debug('<-' + line);
		try {
			const json = JSON.parse(line);
			if (!!json.correlation) {
				this.processReply(json);
			} else {
				this.processState(json);
			}
		} catch (e) {
			ndiLogger.error('onProcessLine:' + e);
		}
	}

	private processReply(reply: IReply) {
		const resolution = this.resolutions.get(reply.correlation);
		if (resolution) {
			this.resolutions.delete(reply.correlation);
			if (reply.ok) {
				resolution.resolve(reply.payload);
			} else {
				resolution.reject(reply.error);
			}
		} else {
			ndiLogger.error(
				'processReply:Resolution id for correlation ' +
					reply.correlation +
					' not found',
			);
		}
	}

	private processState(state: IState) {
		switch (state.command) {
			case 'OnIceConnectionChange':
				const icc = (state.payload as any).state;
				this.peer._updateIceConnectionState(icc);
				break;
			case 'OnIceGatheringChange':
				const igc = (state.payload as any).state;
				this.peer._updateIceGatheringState(igc);
				break;
			case 'OnSignalingChange':
				const sc = (state.payload as any).state;
				this.peer._updateSignalingState(sc);
				break;
			case 'OnIceCandidate':
				if (this.peer.onicecandidate) {
					this.peer.onicecandidate({ candidate: state.payload });
				}
				break;
			case 'OnDataChannel':
				const name = (state.payload as any).name;
				this.peer._onDataChannel(name);
				break;
			case 'OnDataChannelStateChange': {
				const channel = this.peer._getChannel();
				if (channel) {
					const dcsc = (state.payload as any).state;
					channel._updateDataChannelState(dcsc);
				}
				break;
			}
			case 'OnDataChannelMessage': {
				const channel = this.peer._getChannel();
				if (channel && channel.onmessage) {
					channel.onmessage(state.payload);
				}
				break;
			}
			case 'OnAddTrack':
				this.peer._onAddTrack(state.payload);
				break;
			case 'OnRemoveTrack':
				this.peer._onRemoveTrack(state.payload);
				break;
			default:
				ndiLogger.error('processState:Invalid state' + state.payload);
		}
	}

	private createArguments(): any[] {
		return [];
	}

	private onProcessStdErr(data: string) {
		const lines = data.split(/\r\n|\r|\n/);
		lines.forEach(line => {
			if (line.length > 0) {
				ndiLogger.info('- ' + line);
			}
		});
	}

	private onProcessExit(code: number, signal: string) {
		if (!this.destroyed) {
			this.peer._onError('Process exited unexpectedly');
			ndiLogger.error('process exited -> ' + code + ' -> ' + signal);
		} else {
			ndiLogger.info('process exited -> ' + code + ' -> ' + signal);
		}
		//
		for (const value of this.resolutions.values()) {
			value.reject('onProcessExit:signaling closed');
		}
	}

	private writeLine(line: string) {
		ndiLogger.debug('->' + line);
		this.process.stdin.write(line + os.EOL);
	}
}
