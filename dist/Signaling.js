"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const readline_1 = require("readline");
const Logger_1 = require("./Logger");
const os_1 = __importDefault(require("os"));
class Signaling {
    constructor(peer) {
        this.peer = peer;
        this.lastCorrelation = 0;
        this.resolutions = new Map();
    }
    spawn() {
        this.process = child_process_1.spawn('ndi-webrtc-peer-worker', this.createArguments());
        this.process.on('exit', (code, signal) => this.onProcessExit(code, signal));
        //
        this.process.stderr.setEncoding('utf-8');
        this.process.stdout.setEncoding('utf-8');
        this.process.stdin.setDefaultEncoding('utf-8');
        //
        this.process.stderr.on('data', data => this.onProcessStdErr(data));
        this.reader = readline_1.createInterface({
            input: this.process.stdout,
            output: null,
            terminal: false,
        });
        this.reader.on('line', line => this.onProcessLine(line));
    }
    destroy() {
        this.reader.close();
        this.writeLine('STOP');
    }
    request(command, payload) {
        const promise = new Promise((resolve, reject) => {
            this.lastCorrelation++;
            const correlation = this.lastCorrelation;
            //
            const json = { command, payload, correlation };
            this.writeLine(JSON.stringify(json));
            //
            const resolution = { reject, resolve };
            this.resolutions.set(correlation, resolution);
        });
        return promise;
    }
    //
    //
    //
    onProcessLine(line) {
        Logger_1.ndiLogger.debug('<-' + line);
        try {
            const json = JSON.parse(line);
            if (!!json.correlation) {
                this.processReply(json);
            }
            else {
                this.processState(json);
            }
        }
        catch (e) {
            Logger_1.ndiLogger.error('onProcessLine:' + e);
        }
    }
    processReply(reply) {
        const resolution = this.resolutions.get(reply.correlation);
        if (resolution) {
            this.resolutions.delete(reply.correlation);
            if (reply.ok) {
                resolution.resolve(reply.payload);
            }
            else {
                resolution.reject(reply.error);
            }
        }
        else {
            Logger_1.ndiLogger.error('processReply:Resolution id for correlation ' +
                reply.correlation +
                ' not found');
        }
    }
    processState(state) {
        switch (state.command) {
            case 'OnIceConnectionChange':
                const icc = state.payload.state;
                this.peer._updateIceConnectionState(icc);
                break;
            case 'OnIceGatheringChange':
                const igc = state.payload.state;
                this.peer._updateIceGatheringState(igc);
                break;
            case 'OnSignalingChange':
                const sc = state.payload.state;
                this.peer._updateSignalingState(sc);
                break;
            case 'OnIceCandidate':
                if (this.peer.onicecandidate) {
                    this.peer.onicecandidate({ candidate: state.payload });
                }
                break;
            case 'OnDataChannel':
                const name = state.payload.name;
                this.peer._onDataChannel(name);
                break;
            case 'OnDataChannelStateChange': {
                const channel = this.peer._getChannel();
                if (channel) {
                    const dcsc = state.payload.state;
                    channel._updateDataChannelState(dcsc);
                }
                break;
            }
            case 'OnDataChannelMessage': {
                const channel = this.peer._getChannel();
                if (channel && channel.onmessage) {
                    channel.onmessage(state.payload);
                }
                break;
            }
            case 'OnAddTrack':
                if (this.peer.ontrack) {
                    this.peer.ontrack(state.payload);
                }
                break;
            case 'OnRemoveTrack':
                break;
            default:
                Logger_1.ndiLogger.error('processState:Invalid state' + state.payload);
        }
    }
    createArguments() {
        return [];
    }
    onProcessStdErr(data) {
        const lines = data.split(/\r\n|\r|\n/);
        lines.forEach(line => {
            if (line.length > 0) {
                Logger_1.ndiLogger.info('- ' + line);
            }
        });
    }
    onProcessExit(code, signal) {
        for (const value of this.resolutions.values()) {
            value.reject('onProcessExit:signaling closed');
        }
    }
    writeLine(line) {
        Logger_1.ndiLogger.debug('->' + line);
        this.process.stdin.write(line + os_1.default.EOL);
    }
}
exports.Signaling = Signaling;
//# sourceMappingURL=Signaling.js.map