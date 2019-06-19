interface LoggerInterface {
    debug: (...args: any[]) => void;
    info: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
}
export declare let ndiLogger: LoggerInterface;
export declare const setNDILogger: (l: LoggerInterface) => void;
export {};
