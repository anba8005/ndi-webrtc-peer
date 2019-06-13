"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NDIMediaStream {
    constructor(track) {
        this.track = track;
    }
    getTracks() {
        return [this.track];
    }
    getTrack() {
        return this.track;
    }
}
exports.NDIMediaStream = NDIMediaStream;
//# sourceMappingURL=NDIMediaStream.js.map