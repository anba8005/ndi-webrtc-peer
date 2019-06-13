import { NDIMediaTrack } from './NDIMediaTrack';
export declare class NDIMediaStream {
    private track;
    constructor(track: NDIMediaTrack);
    getTracks(): NDIMediaTrack[];
    getTrack(): NDIMediaTrack;
}
