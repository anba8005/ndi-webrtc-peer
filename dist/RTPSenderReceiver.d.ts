interface MediaStreamTrackInterface {
    id: string;
    kind: string;
}
export interface RTPSenderInterface {
    track: MediaStreamTrackInterface;
}
export interface RTPReceiverInterface {
    track: MediaStreamTrackInterface;
}
export {};
