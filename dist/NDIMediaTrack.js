"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let uniqueId = 0;
function createUniqueId() {
    uniqueId++;
    return uniqueId;
}
class NDIMediaTrack {
    constructor(name, video = true, videoOptions = {}, audio = true, audioOptions = {}) {
        this.id = createUniqueId().toString();
        this.name = name;
        this.video = video;
        this.videoOptions = videoOptions;
        this.audio = audio;
        this.audioOptions = audioOptions;
    }
}
exports.NDIMediaTrack = NDIMediaTrack;
//# sourceMappingURL=NDIMediaTrack.js.map