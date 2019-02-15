import { NDIMediaTrack } from './NDIMediaTrack';

export class NDIMediaStream {

	constructor(private track: NDIMediaTrack) {
	}

	public getTracks() {
		return [this.track];
	}

	public getTrack() {
		return this.track;
	}

}
