import { PreviewConfiguration } from './NDIPeerConfiguration';
import { ndiLogger } from './Logger';
import Ffmpeg, { FfmpegCommand } from 'fluent-ffmpeg';
import os from 'os';
import { RetryWithTimeout } from './RetryWithTimeout';

const DEFAULT_CONFIG: PreviewConfiguration = {
	width: 160,
	height: 90,
	videoOptions: ['-preset veryfast', '-g 25', '-tune zerolatency'],
	audioOptions: [],
};

export class PreviewStreamer {
	private _spawned: boolean = false;
	private _ffmpeg: FfmpegCommand;
	private _ffmpegRetry: RetryWithTimeout;

	constructor(private _config: PreviewConfiguration, private _ndiName: string) {
		Object.assign(_config, DEFAULT_CONFIG); // set defaults
		this._ffmpegRetry = new RetryWithTimeout(this._restartFfmpeg);
	}

	public spawn() {
		if (this._spawned) {
			return;
		}
		//
		this._spawned = true;
		ndiLogger.info('Starting preview streamer for ' + this._ndiName);

		// cleanup
		this._ffmpegRetry.reset();
		if (this._ffmpeg) {
			this._ffmpeg.removeAllListeners('error');
			this._ffmpeg.removeAllListeners('end');
			this._ffmpeg = null;
		}

		// create
		this._ffmpeg = Ffmpeg({
			logger: ndiLogger,
		});

		// add input
		this._ffmpeg
			.input(os.hostname().toUpperCase() + ' (' + this._ndiName + ')')
			.inputFormat('libndi_newtek')
			.inputOptions([
				'-flags +low_delay',
				'-protocol_whitelist file,udp,rtp',
				'-fflags +nobuffer',
			]);

		// add video
		if (this._config.videoUrl) {
			const size = this._config.width + 'x' + this._config.height;
			this._ffmpeg
				.output(this._config.videoUrl)
				.videoCodec('libx264')
				.addOutputOptions(this._config.videoOptions)
				.addOutputOption('-pix_fmt yuv420p')
				.addOutputOption('-threads 2')
				.withNoAudio()
				.size(size)
				.autopad(true, 'black')
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

	public destroy() {
		if (!this._spawned) {
			return;
		}

		//
		ndiLogger.info('Stopping preview streamer for ' + this._ndiName);
		this._ffmpegRetry.reset();
		this._spawned = false;
		this._ffmpeg.kill('SIGKILL');
	}

	private _ffmpegErrorListener = (e: any) => {
		if (
			e.message.indexOf('ffmpeg was killed with signal SIGKILL') !== -1 &&
			!this._spawned
		) {
			return;
		}
		//
		ndiLogger.warn('%s -> %s', this._ndiName, e.message);
		if (this._spawned) {
			this._ffmpegRetry.try();
		}
	};

	private _ffmpegEndListener = () => {
		ndiLogger.info('%s -> ffmpeg exited', this._ndiName);
	};

	private _restartFfmpeg = () => {
		if (this._spawned) {
			ndiLogger.info('%s -> restarting ffmpeg', this._ndiName);
			this._ffmpeg.run();
		}
	};
}
