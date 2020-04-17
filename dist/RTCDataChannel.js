"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataChannelStates = ['connecting', 'open', 'closing', 'closed'];
class RTCDataChannel {
    constructor(label, signaling) {
        this.signaling = signaling;
        this.bufferedAmount = 0;
        this.bufferedAmountLowThreshold = 0;
        this.label = label;
    }
    send(data) {
        return this.signaling
            .request('sendDataMessage', {
            data,
        })
            .catch(e => {
            this._onError(e);
        });
    }
    close() {
        //
    }
    _updateDataChannelState(state) {
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
    _onError(error) {
        if (this.onerror && !this.signaling.isDestroyed) {
            this.onerror(error);
        }
    }
}
exports.RTCDataChannel = RTCDataChannel;
//# sourceMappingURL=RTCDataChannel.js.map