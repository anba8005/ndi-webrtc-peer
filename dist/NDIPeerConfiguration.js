"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createDefaultConfiguration() {
    return {
        ndi: {
            name: 'TEST',
            persistent: false,
        },
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
        ],
    };
}
exports.createDefaultConfiguration = createDefaultConfiguration;
//# sourceMappingURL=NDIPeerConfiguration.js.map