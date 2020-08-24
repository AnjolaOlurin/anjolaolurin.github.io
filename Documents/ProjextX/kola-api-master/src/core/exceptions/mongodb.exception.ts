import {HttpStatus} from '@nestjs/common';
import {Utils} from '../helpers/utils';
import {CustomException} from './custom-exception';
import {AppStatus} from '../helpers/enums';

export class MongodbException extends CustomException {

    constructor(err: any, code: number = AppStatus.DATABASE_ERROR) {
        super(err, code, HttpStatus.INTERNAL_SERVER_ERROR, 'Database error');
    }

    public getMessage() {

        switch (this.getError().name) {
            case 'ValidationError':
                return this.getValidationMessage();
            case 'MongoError' :
                return this.getMongoMessage();
        }

    }

    private getMongoMessage(){

        switch (this.getError().code) {
            case 11000:
            case 11001:
                return this.getDuplicateMessage();
            default:
                return this.getError().errmsg || 'Service Unavailable';
        }

    }

    private getValidationMessage() {
        const keys = Object.keys(this.getError().errors);
        return this.getError().errors[keys[0]].message;
    }

    private getDuplicateMessage() {
        let index;
        const indexMatch = this.getError().errmsg.match('index:\\W+(\\w+)');

        if (indexMatch) {
            index = indexMatch[1];
            index = index.split('_')[0] || index;
            index = Utils.toSentenceCase(index);
            return `${index} Already Exists`;
        }

        return 'Index Already Exists';
    }
}
