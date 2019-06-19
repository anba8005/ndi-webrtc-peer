interface LoggerInterface {
    debug: (...args: any[]) => void;
    info: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
}
export declare let logger: LoggerInterface;
export declare const setLogger: (l: LoggerInterface) => void;
export {};
