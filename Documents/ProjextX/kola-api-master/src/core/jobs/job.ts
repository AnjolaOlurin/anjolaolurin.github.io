import {Utils} from '../helpers/utils';
import {WorkerQueue} from '../helpers/enums';
import {QueueableData} from '../interfaces/queueable.data';

/**
 * Created by EdgeTech on 8/11/2016.
 */

export abstract class Job implements QueueableData {

    protected id: string;
    public queueName: string;

    constructor(queueName: WorkerQueue) {
        this.queueName = queueName;
        this.id = Utils.generateRandomID(16);
    }

    public getId() {
        return this.id;
    }
}
