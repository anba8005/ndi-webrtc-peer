import { NDIMediaStream } from './NDIMediaStream';
export interface AudioOptions {
    autoGainControl?: boolean;
    noiseSuppression?: boolean;
    highPassFilter?: boolean;
    echoCancellation?: boolean;
    typingDetection?: boolean;
    residualEchoDetector?: boolean;
}
export interface VideoOptions {
    width?: number;
    height?: number;
    lowBandwidth?: boolean;
}
export declare class NDIMediaTrack {
    id: string;
    name: string;
    video: boolean;
    videoOptions: VideoOptions;
    audio: boolean;
    audioOptions: AudioOptions;
    replaceTrack?: (oldTrack: NDIMediaTrack, newTrack: NDIMediaTrack, stream: NDIMediaStream) => Promise<void>;
    constructor(name: string, video?: boolean, videoOptions?: VideoOptions, audio?: boolean, audioOptions?: AudioOptions);
}
