"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("./Logger");
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const os_1 = __importDefault(require("os"));
const RetryWithTimeout_1 = require("./RetryWithTimeout");
const NDI_1 = require("./NDI");
const DEFAULT_CONFIG = {
    width: 160,
    height: 90,
    videoOptions: [
        '-vcodec libx264',
        '-pix_fmt yuv420p',
        '-preset veryfast',
        '-g 25',
        '-tune zerolatency',
        '-profile baseline',
    ],
    audioOptions: [],
};
class PreviewStreamer {
    constructor(_config, ndiName) {
        this._spawned = false;
        this._ffmpegErrorListener = (e) => {
            if (e.message.indexOf('ffmpeg was killed with signal SIGKILL') !== -1 &&
                !this._spawned) {
                return;
            }
            //
            Logger_1.ndiLogger.warn(this._ndiName + ' -> ' + e.message);
            if (this._spawned) {
                this._ffmpegRetry.try();
            }
        };
        this._ffmpegEndListener = () => {
            Logger_1.ndiLogger.info(this._ndiName + ' -> ffmpeg exited');
        };
        this._restartFfmpeg = () => {
            if (this._spawned) {
                Logger_1.ndiLogger.info(this._ndiName + ' -> restarting ffmpeg');
                this._ffmpeg.run();
            }
        };
        const defaultConfig = Object.assign({}, DEFAULT_CONFIG);
        this._config = Object.assign(defaultConfig, _config); // set defaults
        this._ffmpegRetry = new RetryWithTimeout_1.RetryWithTimeout(this._restartFfmpeg);
        this._ndiName = this._config.separateNDISource
            ? 'z_preview_' + ndiName
            : ndiName;
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
        // set executable path
        this._ffmpeg.setFfmpegPath(NDI_1.getFFMpegName());
        // add input
        this._ffmpeg
            .input(os_1.default.hostname().toUpperCase() + ' (' + this._ndiName + ')')
            .inputFormat('libndi_newtek')
            .inputOptions([
            '-flags +low_delay',
            '-protocol_whitelist file,udp,rtp,http',
            '-fflags +nobuffer',
        ]);
        // add video
        if (this._config.videoUrl) {
            const format = this._config.videoUrl.startsWith('http')
                ? 'mpegts'
                : 'rtp';
            this._ffmpeg
                .output(this._config.videoUrl)
                .addOutputOptions(this._config.videoOptions)
                .addOutputOption('-threads 1')
                .withNoAudio()
                .outputFormat(format);
            if (!this._config.separateNDISource) {
                this._ffmpeg.withSize(this._config.width + 'x' + this._config.height);
            }
        }
        // add audio
        if (this._config.audioUrl) {
            const format = this._config.videoUrl.startsWith('http')
                ? 'mpegts'
                : 'rtp';
            this._ffmpeg
                .output(this._config.audioUrl)
                .audioCodec('libopus')
                .withNoVideo()
                .outputFormat(format);
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
        if (this._config.separateNDISource) {
            return this._getSeparateNDIConfig(master);
        }
        else {
            return undefined;
        }
    }
    _getSeparateNDIConfig(master) {
        let outputMode = this._config.outputMode;
        if (!outputMode) {
            if (master) {
                // try to copy from master
                if (master.outputMode !== 'vertical') {
                    outputMode = master.outputMode;
                }
            }
            else {
                // set default
                outputMode = 'default';
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