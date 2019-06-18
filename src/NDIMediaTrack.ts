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
	echoCancelation?: boolean;
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
		width?: number,
		height?: number,
	) {
		this.id = createUniqueId().toString();
		this.name = name;
		this.video = video;
		this.audio = audio;
		this.audioOptions = audioOptions;
		this.width = width;
		this.height = height;
	}
}
