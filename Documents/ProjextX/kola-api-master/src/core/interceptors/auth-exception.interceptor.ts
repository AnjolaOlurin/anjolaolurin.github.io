import {NestInterceptor, ExecutionContext, HttpStatus, Injectable, CallHandler} from '@nestjs/common';
import {HttpException} from '@nestjs/common';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class AuthExceptionInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError((err) => throwError(
                new HttpException('Exception interceptor message', HttpStatus.BAD_GATEWAY)),
            ),
        );
    }
}
