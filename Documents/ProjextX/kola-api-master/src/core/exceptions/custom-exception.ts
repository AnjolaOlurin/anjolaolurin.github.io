/**
 * The base Exception class
 */
import {HttpException} from '@nestjs/common';

export class CustomException extends HttpException {
    private error;
    private code;
    private customMsg;
    private body;

    constructor(err: any, code: number, status: number,  message: string, body?: any) {
        const customMsg = typeof err === 'string' ? err : message;
        super(customMsg, status);

        this.customMsg = customMsg;
        this.code = code;
        this.body = body;
        this.setError(err);
    }

    public setError(err) {
        if (typeof err !== 'string') { this.error = err; }
        return this;
    }

    public getCode(): any {
        return this.code;
    }

    public getError(): any {
        return this.error;
    }

    public getMessage(): string {
        return this.customMsg;
    }

    public getBody(): string {
        return this.body;
    }

    public setMessage(str) {
        this.customMsg = str;
        return this;
    }
}
