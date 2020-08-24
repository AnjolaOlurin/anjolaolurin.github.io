import {IEvent} from './event.interface';

export class EventTask<T = any> implements IEvent<T>{

    readonly consumer: string;
    readonly name: string;
    readonly data: T;

    constructor(consumer: string, name: string, data: T){
        this.consumer = consumer;
        this.name = name;
        this.data = data;
    }
}

export const EventTasks = {
    PROFILE_PHOTO_UPLOAD : 'PROFILE_PHOTO_UPLOAD',
    USER_SAVED : 'USER_SAVED',
    EMAIL_CONFIRMATION_REQUEST : 'EMAIL_CONFIRMATION_REQUEST',
    RESET_PASSWORD_REQUEST : 'RESET_PASSWORD_REQUEST',
    ACTIVATE_ACCOUNT_REQUEST : 'ACTIVATE_ACCOUNT_REQUEST',
    SIGNIN_ACCOUNT_REQUEST : 'SIGNIN_ACCOUNT_REQUEST',
};
