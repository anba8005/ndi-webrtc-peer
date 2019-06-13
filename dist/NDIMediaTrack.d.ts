import { NDIMediaStream } from './NDIMediaStream';
export interface AudioOptions {
    autoGainControl?: boolean;
    noiseSuppression?: boolean;
    highPassFilter?: boolean;
    echoCancelation?: boolean;
    typingDetection?: boolean;
    residualEchoDetector?: boolean;
}
export declare class NDIMediaTrack {
    id: string;
    name: string;
    video: boolean;
    audio: boolean;
    audioOptions: AudioOptions;
    replaceTrack?: (oldTrack: NDIMediaTrack, newTrack: NDIMediaTrack, stream: NDIMediaStream) => Promise<void>;
    constructor(name: string, video?: boolean, audio?: boolean, audioOptions?: AudioOptions);
}
