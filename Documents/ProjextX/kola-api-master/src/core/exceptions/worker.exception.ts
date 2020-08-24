import {HttpStatus} from '@nestjs/common';
import {CustomException} from './custom-exception';
import { AppStatus } from '@core/helpers';

export class WorkerException extends CustomException {

    constructor(err: any, code: number = AppStatus.WORKER_ERROR, status: number = HttpStatus.INTERNAL_SERVER_ERROR, message = 'Worker Exception') {
        super(err, code, status, message);
    }
}
