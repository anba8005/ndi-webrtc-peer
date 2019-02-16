import { Signaling } from './Signaling';

const dataChannelStates = ['connecting', 'open', 'closing', 'closed'];

export class RTCDataChannel {
	public onmessage?: (event: any) => void;
	public onbufferedamountlow?: () => void;
	public onopen?: () => void;
	public onclose?: () => void;
	public onerror?: (event: any) => void;

	public bufferedAmount: number = 0;
	public bufferedAmountLowThreshold: number = 0;
	public label: string;
	public readyState: string;

	constructor(label: string, private signaling: Signaling) {
		this.label = label;
	}

	public send(data: any) {
		return this.signaling
			.request<void>('sendDataMessage', {
				data,
			})
			.catch(e => {
				this._onError(e);
			});
	}

	public close() {
		//
	}

	public _updateDataChannelState(state: number) {
		this.readyState = dataChannelStates[state];
		switch (this.readyState) {
			case 'open':
				if (this.onopen) {
					this.onopen();
				}
				break;
			case 'closed':
				if (this.onclose) {
					this.onclose();
				}
				break;
			default:
				break;
		}
	}

	public _onError(error: any) {
		if (this.onerror) {
			this.onerror(error);
		}
	}
}
