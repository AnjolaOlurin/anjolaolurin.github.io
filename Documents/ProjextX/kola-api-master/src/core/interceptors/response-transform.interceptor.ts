import {ExecutionContext, HttpStatus, Injectable, NestInterceptor, CallHandler} from '@nestjs/common';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map(data => {
            if (data && !data.code && typeof data !== 'string') {
                return {code: HttpStatus.OK, message: 'Request Successful', body: data};
            }

            if (typeof data === 'string') {
                return {code: HttpStatus.OK, message: data};
            }

            return data;
        }));
    }
}
