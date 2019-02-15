export class RTCIceCandidate {
	public candidate?: string;
	public sdpMLineIndex?: number | null;
	public sdpMid?: string | null;

	constructor(value: any) {
		this.candidate = value.candidate;
		this.sdpMLineIndex = value.sdpMLineIndex;
		this.sdpMid = value.sdpMid;
	}
}
