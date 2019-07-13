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

export interface VideoOptions {
	width?: number;
	height?: number;
	lowBandwidth?: boolean;
}

export class NDIMediaTrack {
	public id: string;
	public name: string;
	public video: boolean;
	public videoOptions: VideoOptions;
	public audio: boolean;
	public audioOptions: AudioOptions;

	public replaceTrack?: (
		oldTrack: NDIMediaTrack,
		newTrack: NDIMediaTrack,
		stream: NDIMediaStream,
	) => Promise<void>;

	constructor(
		name: string,
		video = true,
		videoOptions: VideoOptions = {},
		audio = true,
		audioOptions: AudioOptions = {},
	) {
		this.id = createUniqueId().toString();
		this.name = name;
		this.video = video;
		this.videoOptions = videoOptions;
		this.audio = audio;
		this.audioOptions = audioOptions;
	}
}
