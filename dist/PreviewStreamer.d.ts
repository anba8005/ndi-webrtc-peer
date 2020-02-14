import { PreviewConfiguration, NDIConfiguration } from './NDIPeerConfiguration';
export declare class PreviewStreamer {
    private _spawned;
    private _ffmpeg;
    private _ffmpegRetry;
    private _ndiName;
    private _config;
    constructor(_config: PreviewConfiguration, ndiName: string);
    spawn(): void;
    destroy(): void;
    getNDIConfig(master: NDIConfiguration): NDIConfiguration;
    private _getSeparateNDIConfig;
    private _ffmpegErrorListener;
    private _ffmpegEndListener;
    private _restartFfmpeg;
    private _beforeExitListener;
}
