import { NDIMediaStream } from './NDIMediaStream';

let uniqueId = 0;
function createUniqueId() {
	uniqueId++;
	return uniqueId;
}

export interface AudioOptions {
	autoGainControl?: boolean;
	noiseSuppression?: boolean;
	highPassFilter?: boolean;
	echoCancellation?: boolean;
	typingDetection?: boolean;
	residualEchoDetector?: boolean;
}

export class NDIMediaTrack {
	public id: string;
	public name: string;
	public video: boolean;
	public audio: boolean;
	public audioOptions: AudioOptions;
	public width?: number;
	public height?: number;
	public channelOffset?: number;
	public numChannels?: number;
	public lowBandwidth: boolean;

	public replaceTrack?: (
		oldTrack: NDIMediaTrack,
		newTrack: NDIMediaTrack,
		stream: NDIMediaStream,
	) => Promise<void>;

	constructor(
		name: string,
		video = true,
		audio = true,
		audioOptions: AudioOptions = {},
		lowBandwidth?: boolean,
		width?: number,
		height?: number,
		channelOffset?: number,
		numChannels?: number,
	) {
		this.id = createUniqueId().toString();
		this.name = name;
		this.video = video;
		this.audio = audio;
		this.audioOptions = audioOptions;
		this.lowBandwidth = lowBandwidth;
		this.width = width;
		this.height = height;
		this.channelOffset = channelOffset;
		this.numChannels = numChannels;
	}
}
