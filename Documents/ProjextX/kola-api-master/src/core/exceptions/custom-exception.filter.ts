import {ArgumentsHost, Catch, ExceptionFilter} from '@nestjs/common';
import {CustomException} from './custom-exception';

@Catch(CustomException)
export class CustomExceptionFilter implements ExceptionFilter {

    public catch(exception: CustomException , host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        response.status(exception.getStatus()).json({
            code: exception.getCode(),
            message: exception.getMessage(),
            body: exception.getBody(),
            error: process.env.NODE_ENV === 'production' ? undefined : exception.getError(),
        });
    }

}
