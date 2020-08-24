/**
 * Created by EdgeTech on 12/11/2016.
 */
import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Job } from '../jobs/job';
import { QueueTasks } from '../helpers/enums';
import { WORKER_SERVICE_TOKEN } from '../providers/worker.provider';
import { WorkerException } from '@core/exceptions';

@Injectable()
export class JobService {
    constructor(@Inject(WORKER_SERVICE_TOKEN) private readonly client: ClientProxy) { }

    public addJobToQueue(job: Job, task: QueueTasks) {
        Logger.log(`Sent Job:${job.queueName} Task:${task}`);
        this.client.send(task, job)
            .subscribe(
                res => Logger.log(`Finished Job:${job.queueName}, Task:${task} in ${res.duration}`),
                e => Logger.error(new WorkerException(e))
            );
    }

}
