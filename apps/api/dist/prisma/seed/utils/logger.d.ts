export declare const logger: {
    info: (msg: string) => void;
    success: (msg: string) => void;
    warn: (msg: string) => void;
    error: (msg: string, err?: unknown) => void;
    progress: (entity: string, count: number) => void;
    section: (title: string) => void;
};
