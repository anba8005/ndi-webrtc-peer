import { Signaling } from './Signaling';
export declare class RTCDataChannel {
    private signaling;
    onmessage?: (event: any) => void;
    onbufferedamountlow?: () => void;
    onopen?: () => void;
    onclose?: () => void;
    onerror?: (event: any) => void;
    bufferedAmount: number;
    bufferedAmountLowThreshold: number;
    label: string;
    readyState: string;
    constructor(label: string, signaling: Signaling);
    send(data: any): Promise<void>;
    close(): void;
    _updateDataChannelState(state: number): void;
    _onError(error: any): void;
}
