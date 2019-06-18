export interface NDIPeerConfiguration extends RTCConfiguration {
    ndi: {
        name: string;
        width?: number;
        height?: number;
        frameRate?: number;
        persistent?: boolean;
    };
    cpuAdaptation?: boolean;
}
