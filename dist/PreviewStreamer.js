"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("./Logger");
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const os_1 = __importDefault(require("os"));
const RetryWithTimeout_1 = require("./RetryWithTimeout");
const DEFAULT_CONFIG = {
    width: 160,
    height: 90,
    videoOptions: ['-preset veryfast', '-g 25', '-tune zerolatency'],
    audioOptions: [],
};
class PreviewStreamer {
    constructor(_config, ndiName) {
        this._config = _config;
        this._spawned = false;
        this._ffmpegErrorListener = (e) => {
            if (e.message.indexOf('ffmpeg was killed with signal SIGKILL') !== -1 &&
                !this._spawned) {
                return;
            }
            //
            Logger_1.ndiLogger.warn('%s -> %s', this._ndiName, e.message);
            if (this._spawned) {
                this._ffmpegRetry.try();
            }
        };
        this._ffmpegEndListener = () => {
            Logger_1.ndiLogger.info('%s -> ffmpeg exited', this._ndiName);
        };
        this._restartFfmpeg = () => {
            if (this._spawned) {
                Logger_1.ndiLogger.info('%s -> restarting ffmpeg', this._ndiName);
                this._ffmpeg.run();
            }
        };
        Object.assign(_config, DEFAULT_CONFIG); // set defaults
        this._ffmpegRetry = new RetryWithTimeout_1.RetryWithTimeout(this._restartFfmpeg);
        this._ndiName = 'z_preview_' + ndiName;
    }
    spawn() {
        if (this._spawned) {
            return;
        }
        //
        this._spawned = true;
        Logger_1.ndiLogger.info('Starting preview streamer for ' + this._ndiName);
        // cleanup
        this._ffmpegRetry.reset();
        if (this._ffmpeg) {
            this._ffmpeg.removeAllListeners('error');
            this._ffmpeg.removeAllListeners('end');
            this._ffmpeg = null;
        }
        // create
        this._ffmpeg = fluent_ffmpeg_1.default({
            logger: Logger_1.ndiLogger,
        });
        // add input
        this._ffmpeg
            .input(os_1.default.hostname().toUpperCase() + ' (' + this._ndiName + ')')
            .inputFormat('libndi_newtek')
            .inputOptions([
            '-flags +low_delay',
            '-protocol_whitelist file,udp,rtp',
            '-fflags +nobuffer',
        ]);
        // add video
        if (this._config.videoUrl) {
            this._ffmpeg
                .output(this._config.videoUrl)
                .videoCodec('libx264')
                .addOutputOptions(this._config.videoOptions)
                .addOutputOption('-pix_fmt yuv420p')
                .addOutputOption('-threads 2')
                .withNoAudio()
                .outputFormat('rtp');
        }
        // add audio
        if (this._config.audioUrl) {
            this._ffmpeg
                .output(this._config.audioUrl)
                .audioCodec('libopus')
                .withNoVideo()
                .outputFormat('rtp');
        }
        // add event listeners
        this._ffmpeg.addListener('error', this._ffmpegErrorListener);
        this._ffmpeg.addListener('end', this._ffmpegEndListener);
        // ndiLogger.info(this._ffmpeg._getArguments());
        this._ffmpeg.run();
    }
    destroy() {
        if (!this._spawned) {
            return;
        }
        //
        Logger_1.ndiLogger.info('Stopping preview streamer for ' + this._ndiName);
        this._ffmpegRetry.reset();
        this._spawned = false;
        this._ffmpeg.kill('SIGKILL');
    }
    getNDIConfig(master) {
        let outputMode = this._config.outputMode;
        if (!outputMode) {
            // try to copy from master
            if (master.outputMode !== 'vertical') {
                outputMode = master.outputMode;
            }
        }
        //
        return {
            name: this._ndiName,
            width: this._config.width,
            height: this._config.height,
            outputMode,
            persistent: false,
        };
    }
}
exports.PreviewStreamer = PreviewStreamer;
//# sourceMappingURL=PreviewStreamer.js.map