export class ClientCreationException extends Error {
    public readonly originalError: any;

    constructor(message: string, originalError?: any) {
        super(message);
        this.name = 'ClientCreationException';
        this.originalError = originalError;
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ClientCreationException);
        }
    }
}
