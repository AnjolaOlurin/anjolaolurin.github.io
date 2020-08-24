/**
 * Created by EdgeTech on 12/12/2016.
 */
import {Job} from './job';
import {WorkerQueue} from '../helpers/enums';

export interface IEmailName {
    email: string;
    name?: string;
}

export class EmailJob extends Job {

    private from: IEmailName;
    private to: IEmailName;
    private subject: string;
    private template: string;
    private content: object;

    constructor() {
        super(WorkerQueue.PROCESS_WORK);
    }

    public setFrom(value: IEmailName) {
        this.from = value;
        return this;
    }

    public setTo(value: IEmailName) {
        this.to = value;
        return this;
    }

    public setSubject(value: string) {
        this.subject = value;
        return this;
    }

    public setTemplate(value: string) {
        this.template = value;
        return this;
    }

    public setContent(content: object) {
        this.content = content;
        return this;
    }

}
