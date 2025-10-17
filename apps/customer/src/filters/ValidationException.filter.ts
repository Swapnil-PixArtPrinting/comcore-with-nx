import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  ValidationError,
} from '@nestjs/common';
import { request, Response } from 'express';
import { FailureResponse } from '../responses/failure.response';
import { LoggingService } from '../../../../libs/common/src';

/**
 * Filter that catches all exceptions that are instances of BadRequestException and sends a custom response to the client.
 */
@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) {}

  /**
   * Catch all exceptions that are instances of BadRequestException and send a custom response to the client.
   * @param exception
   * @param host
   */
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // Get the context
    const response = ctx.getResponse<Response>(); // Get the response object

    const status = exception.getStatus(); // Get the status code
    const exceptionResponse = exception.getResponse() as any; // Get the response body

    let formattedErrors = {}; // Initialize the formatted errors object

    // Check if the exception response has a message and it is an array
    if (exceptionResponse?.message && Array.isArray(exceptionResponse.message)) {
      // Check if errors are from class-validator
      if (
        exceptionResponse.message[0] &&
        typeof exceptionResponse.message[0] === 'object' &&
        exceptionResponse.message[0].property
      ) {
        formattedErrors = this.formatValidationErrors(exceptionResponse.message);
      } else {
        // Fallback for string-based errors
        formattedErrors = exceptionResponse.message;
      }
    }

    // Create the error meta object
    const errorMeta = {
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      requestBody: request.body,
    };

    const errorDetails = {
      error: formattedErrors,
      errorMeta: errorMeta,
    };

    this.loggingService.error(['Error'], 'Validation Exception', errorDetails, {});

    // Send the custom failure response
    return new FailureResponse(
      'Request Validation Failed',
      status,
      formattedErrors,
      status, // Using status as errorCode
      'ValidationError',
      errorMeta,
    ).send(response);
  }

  private formatValidationErrors(errors: ValidationError[]): Record<string, string[]> {
    const formattedErrors: Record<string, string[]> = {};

    errors.forEach((error) => {
      if (!formattedErrors[error.property]) {
        formattedErrors[error.property] = [];
      }

      if (error.constraints) {
        formattedErrors[error.property].push(...Object.values(error.constraints));
      }

      // Handle nested validation errors (if any)
      if (error.children && error.children.length > 0) {
        Object.assign(formattedErrors, this.formatValidationErrors(error.children));
      }
    });

    return formattedErrors;
  }
}
