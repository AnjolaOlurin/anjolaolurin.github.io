/**
 * Created by EdgeTech on 12/12/2016.
 */
import {Job} from './job';
import {WorkerQueue} from '../helpers/enums';
import { User } from '@api/users';

export class CRCJob extends Job {
    private userId: number;
    private bvn: string;

    constructor(user: User) {
        super(WorkerQueue.PROCESS_WORK);
        this.userId = user.id;
        this.bvn = user.bvn;
    }
}
