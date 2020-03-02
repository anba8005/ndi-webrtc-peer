export interface PreviewConfiguration {
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
export interface DecoderConfiguration {
    hardware: 'none' | 'vaapi';
}
export interface EncoderConfiguration {
    hardware: 'none' | 'vaapi';
}
export interface NDIPeerConfiguration extends RTCConfiguration {
    ndi: NDIConfiguration;
    preview?: PreviewConfiguration;
    cpuAdaptation?: boolean;
    decoder?: DecoderConfiguration;
    encoder?: EncoderConfiguration;
}
