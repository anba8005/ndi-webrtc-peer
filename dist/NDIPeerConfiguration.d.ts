export interface PreviewConfiguration {
    name?: string;
    videoUrl?: string;
    audioUrl?: string;
    videoOptions?: string[];
    audioOptions?: string[];
    width?: number;
    height?: number;
    outputMode?: 'default' | 'square';
    separateNDISource?: boolean;
}
export interface NDIConfiguration {
    name: string;
    width?: number;
    height?: number;
    frameRate?: number;
    persistent?: boolean;
    outputMode?: 'default' | 'vertical' | 'square';
}
declare type Codecs = 'vp8' | 'vp9' | 'h264' | 'h265';
export interface DecoderConfiguration {
    hardware: 'none' | 'vaapi';
    software?: Codecs[];
}
export interface EncoderConfiguration {
    hardware: 'none' | 'vaapi' | 'mfx' | 'videotoolbox';
    software?: Codecs[];
    disableH264HighProfile?: boolean;
}
export interface NDIPeerConfiguration extends RTCConfiguration {
    ndi?: NDIConfiguration;
    preview?: PreviewConfiguration;
    cpuAdaptation?: boolean;
    useNonDefaultRoutes?: boolean;
    decoder?: DecoderConfiguration;
    encoder?: EncoderConfiguration;
}
export {};
