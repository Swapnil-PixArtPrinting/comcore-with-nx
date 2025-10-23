import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { RenderableException } from '../exceptions/RenderableException.exception';
import { FailureResponse } from '../responses/failure.response';
import { LoggingService } from '@app/common';

/**
 * Filter that catches all exceptions that are instances of RenderableException and sends a custom response to the client.
 */
@Catch(RenderableException)
export class RenderableExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) {}

  /**
   * Catch all exceptions that are instances of RenderableException and send a custom response to the client.
   * @param exception
   * @param host
   */
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // Get the context
    const response = ctx.getResponse<Response>(); // Get the response object
    const request = ctx.getRequest<Request>(); // Get the request object

    // Get the status code and response body
    const status =
      exception instanceof RenderableException
        ? exception.getHttpStatus()
        : 500;
    // Get the response body from the exception if it is a RenderableException
    const responseBody: any =
      exception instanceof RenderableException ? exception.getDetail() : null;

    // Get the error message, detail, code, type, and input
    const errorMessage =
      exception.message || responseBody?.message || 'Internal Server Error';
    const errorDetail = responseBody || null;
    const errorCode =
      exception instanceof RenderableException ? exception.getCode() : status; // Get correct custom error code
    const errorType =
      exception instanceof RenderableException
        ? exception.getErrorType()
        : 'InternalServerError';
    const errorInput =
      exception instanceof RenderableException ? exception.getInput() : null;

    // Create the error meta object
    const errorMeta = {
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      request: errorInput,
    };

    this.loggingService.error(['Error'], errorMessage, errorDetail, null);

    // Send the custom failure response
    return new FailureResponse(
      errorMessage,
      status,
      errorDetail,
      errorCode,
      errorType,
      errorMeta,
    ).send(response);
  }
}
