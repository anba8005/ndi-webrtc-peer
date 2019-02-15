export class RTCSessionDescription {
	public readonly type: string;
	public readonly sdp: string;

	constructor(value: any) {
		this.type = value.type;
		this.sdp = value.sdp;
	}
}
