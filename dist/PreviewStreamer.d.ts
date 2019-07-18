import { PreviewConfiguration } from './NDIPeerConfiguration';
export declare class PreviewStreamer {
    private _config;
    private _ndiName;
    private _spawned;
    private _ffmpeg;
    private _ffmpegRetry;
    constructor(_config: PreviewConfiguration, _ndiName: string);
    spawn(): void;
    destroy(): void;
    private _ffmpegErrorListener;
    private _ffmpegEndListener;
    private _restartFfmpeg;
}
