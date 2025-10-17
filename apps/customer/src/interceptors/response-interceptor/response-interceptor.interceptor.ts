import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { BaseResponse, SuccessResponse } from '../../responses';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any): BaseResponse => {
        if (!data) {
          return {} as BaseResponse;
        }
        if (data instanceof BaseResponse) {
          return data;
        }

        const message: string = data.message || 'Request was successful';
        const statusCode: number = data.statusCode || 200;
        const responseData: any = data.data || data;
        const meta: Record<string, any> = data.meta || {};

        return new SuccessResponse(message, statusCode, responseData, meta);
      }),
    );
  }
}
