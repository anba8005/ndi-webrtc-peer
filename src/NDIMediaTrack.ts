import { NDIMediaStream } from "./NDIMediaStream";

let uniqueId = 0;
function createUniqueId() {
	uniqueId++;
	return uniqueId;
}

export class NDIMediaTrack {

	public audio: boolean;
	public id: string;
	public name: string;
	public video: boolean;

	public replaceTrack?: (oldTrack: NDIMediaTrack, newTrack: NDIMediaTrack, stream: NDIMediaStream) => Promise<void>;

	constructor(name: string, audio = true, video = true) {
		this.audio = audio;
		this.id = createUniqueId().toString();
		this.name = name;
		this.video = video;
	}
}
