/**
 * Created by EdgeTech on 12/12/2016.
 */
import {Job} from './job';
import {WorkerQueue} from '../helpers/enums';

export class PhotoJob extends Job {
    private userId: string;
    private photoId: string;
    private name: string;
    private url: string;
    private type: string;
    private meta: object;

    constructor() {
        super(WorkerQueue.PROCESS_WORK);
    }

    public setUserId(value: string) {
        this.userId = value;
        return this;
    }

    public setPhotoId(value: string) {
        this.photoId = value;
        return this;
    }

    public setName(value: string) {
        this.name = value;
        return this;
    }

    public setType(value: string) {
        this.type = value;
        return this;
    }

    public setUrl(value: string) {
        this.url = value;
        return this;
    }

    public setMeta(value: object) {
        this.meta = value;
        return this;
    }


}
