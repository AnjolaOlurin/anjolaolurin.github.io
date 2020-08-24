/**
 * Created by EdgeTech on 12/12/2016.
 */
import {Job} from './job';
import {WorkerQueue} from '../helpers/enums';


export class SMSJob extends Job{

    private from : string;
    private to : string;
    private template: string;
    private content: object;

    constructor(){
        super(WorkerQueue.PROCESS_WORK);
    }

    public setFrom(value: string) {
        this.from = value;
        return this;
    }

    public setTo(value: string) {
        this.to = value;
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
