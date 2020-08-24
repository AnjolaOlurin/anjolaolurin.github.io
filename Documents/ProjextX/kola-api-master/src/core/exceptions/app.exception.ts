import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom-exception';
import { AppStatus } from '../helpers/enums';

export class AppException extends CustomException {

    constructor(err: any, code: number, status: number = HttpStatus.INTERNAL_SERVER_ERROR, message = 'App Exception', body?: object) {
        super(err, code, status, message, body);
    }

    public static get INVALID_TOKEN() {
        return new this('Invalid Token', AppStatus.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
    }

    public static get OPERATION_NOT_ALLOWED() {
        return new this('Operation not allowed', AppStatus.OPERATION_NOT_ALLOWED, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    public static get USER_EXIST() {
        return new this('User Exist', AppStatus.USER_EXIST, HttpStatus.BAD_REQUEST);
    }

    public static BVN_REQUIRES_PHONE_CHALLENGE(challenge: string) {
        return new this(
            null,
            AppStatus.BVN_REQUIRES_PHONE_CHALLENGE,
            HttpStatus.EXPECTATION_FAILED, 'BVN confimation requires phone challenge',
            {phoneChallenge: challenge}
        );
    }

    public static get CRC_REPORT_GENERATION_PENDING() {
        return new this('User\'s Report generation is in progress', AppStatus.CRC_REPORT_GENERATION_PENDING, HttpStatus.EXPECTATION_FAILED);
    }

    public static CRC_REPORT_REQUIRES_PHONE_CHALLENGE(challenge: string[]) {
        return new this(
            null,
            AppStatus.CRC_REPORT_CHALLENGE_NOT_FOUND,
            HttpStatus.EXPECTATION_FAILED, 'User\'s Report requires phone challenge',
            challenge
        );
    }

    public static get CRC_REPORT_GENERATION_FAILED() {
        return new this('User\'s Report generation failed', AppStatus.CRC_REPORT_GENERATION_FAILED, HttpStatus.EXPECTATION_FAILED);
    }

    public static get CRC_REPORT_NOT_FOUND() {
        return new this('User\'s Report not found', AppStatus.CRC_REPORT_NOT_FOUND, HttpStatus.EXPECTATION_FAILED);
    }

    public static get CRC_REPORT_CHALLENGE_NOT_FOUND() {
        return new this('Report phone  challenge not found', AppStatus.CRC_REPORT_CHALLENGE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    public static get CRC_REPORT_CHALLENGE_FAILED() {
        return new this('Report phone challenge failed', AppStatus.CRC_REPORT_CHALLENGE_FAILED, HttpStatus.BAD_REQUEST);
    }

}
