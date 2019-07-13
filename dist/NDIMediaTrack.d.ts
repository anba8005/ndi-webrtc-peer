import { NDIMediaStream } from './NDIMediaStream';
export interface AudioOptions {
    autoGainControl?: boolean;
    noiseSuppression?: boolean;
    highPassFilter?: boolean;
    echoCancellation?: boolean;
    typingDetection?: boolean;
    residualEchoDetector?: boolean;
}
export declare class NDIMediaTrack {
    id: string;
    name: string;
    video: boolean;
    audio: boolean;
    audioOptions: AudioOptions;
    width?: number;
    height?: number;
    lowBandwidth: boolean;
    replaceTrack?: (oldTrack: NDIMediaTrack, newTrack: NDIMediaTrack, stream: NDIMediaStream) => Promise<void>;
    constructor(name: string, video?: boolean, audio?: boolean, audioOptions?: AudioOptions, lowBandwidth?: boolean, width?: number, height?: number);
}
