export declare class Reaction {
    private condition;
    private promiseValue;
    private resolve;
    private reject;
    constructor(condition: (line: string) => boolean);
    readonly promise: Promise<void>;
    check(line: string): void;
    cancel(): void;
}
