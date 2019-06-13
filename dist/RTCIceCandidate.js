"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RTCIceCandidate {
    constructor(value) {
        this.candidate = value.candidate;
        this.sdpMLineIndex = value.sdpMLineIndex;
        this.sdpMid = value.sdpMid;
    }
}
exports.RTCIceCandidate = RTCIceCandidate;
//# sourceMappingURL=RTCIceCandidate.js.map