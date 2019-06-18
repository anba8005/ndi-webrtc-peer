export interface NDISource {
    name: string;
    ip: string;
}
export declare function findNDISources(): Promise<NDISource[]>;
