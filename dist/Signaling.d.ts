import { RTCPeerConnection } from './RTCPeerConnection';
export declare class Signaling {
    private peer?;
    private process;
    private reader;
    private lastCorrelation;
    private resolutions;
    constructor(peer?: RTCPeerConnection);
    spawn(): void;
    destroy(): void;
    request<T>(command: string, payload: object): Promise<T>;
    private onProcessLine;
    private processReply;
    private processState;
    private createArguments;
    private onProcessStdErr;
    private onProcessExit;
    private writeLine;
}
