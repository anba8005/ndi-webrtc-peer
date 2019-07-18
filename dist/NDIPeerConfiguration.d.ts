export interface PreviewConfiguration {
    videoUrl?: string;
    audioUrl?: string;
    videoOptions?: string[];
    audioOptions?: string[];
    width?: number;
    height?: number;
}
export interface NDIPeerConfiguration extends RTCConfiguration {
    ndi: {
        name: string;
        width?: number;
        height?: number;
        frameRate?: number;
        persistent?: boolean;
    };
    preview?: PreviewConfiguration;
    cpuAdaptation?: boolean;
}
