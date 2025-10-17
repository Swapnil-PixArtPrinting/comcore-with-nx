import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggingService } from '../../../../libs/common/src';

/**
 * Global exception filter that catches all exceptions and sends a generic response to the client.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) {}

  /**
   * Catch all exceptions and send a generic response to the client.
   * @param exception
   * @param host
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = 500; // Internal server error
    let message = 'Internal server error'; // Default message
    let errorDetails: any = null; // Additional error details

    // Handle different types of exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message;
      errorDetails = exceptionResponse;
    } else if (exception instanceof Error) {
      // AWS SDK or generic JS error
      message = exception.message;
      errorDetails = {
        name: exception.name,
        stack: exception.stack,
      };

      // AWS SDK-specific errors (like AuthorizationErrorException)
      if ('code' in exception) {
        errorDetails.code = (exception as any).code;
      }
    }

    this.loggingService.error(['Error'], message, exception as any, {
      trace: exception instanceof Error ? exception.stack : new Error().stack,
      path: request.url,
      method: request.method,
    });

    // Send a generic response to the client
    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      errorDetails, // Include error details for debugging
    });
  }
}
