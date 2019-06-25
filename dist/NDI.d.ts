export interface NDISource {
    name: string;
    ip: string;
}
export declare function findNDISources(): Promise<NDISource[]>;
export declare function initializeNativeCode(): Promise<boolean>;
export declare function isNativeCodePackaged(): boolean;
export declare function getPackagedWorkerName(): string;
export declare function getTmpWorkerName(): string;
