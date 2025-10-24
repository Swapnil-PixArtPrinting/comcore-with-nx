import { HttpException } from '@nestjs/common';

/**
 * Custom exception class that can be rendered to the client
 */
export class RenderableException extends HttpException {
  private readonly detail: object | string;
  private readonly errorMessage: string;
  private readonly httpStatus: number;
  private readonly code: number;
  private readonly input: string | object;
  private readonly errorType: string;

  /**
   *
   * @param errorMessage
   * @param detail
   * @param code
   * @param previous
   * @param httpStatus
   * @param input
   * @param errorType
   * @param location
   */
  constructor(
    errorMessage: string,
    detail: object | string = null,
    code: number = 500,
    previous?: RenderableException,
    httpStatus?: number,
    input?: string | object,
    errorType?: string,
    location?: string,
  ) {
    super(errorMessage, httpStatus || code); // Ensure message is passed correctly
    this.detail = detail; // Store the detail
    this.httpStatus = RenderableException.isHttpCode(httpStatus)
      ? httpStatus
      : code; // Store the http status
    this.code = code; // Store the custom error code
    this.errorType = errorType; // Store the error type
    this.input = input; // Store the input

    // If there is a previous exception, use its code and detail
    if (previous) {
      const previousCode = previous.getCode();
      if (RenderableException.isHttpCode(previousCode)) {
        this.httpStatus = previousCode;
      } else if (previous instanceof RenderableException) {
        this.httpStatus = previous.getHttpStatus();
      }

      if (!this.detail) {
        this.detail =
          previous instanceof RenderableException
            ? previous.getDetail()
            : this.getDetail();
      }
    }

    if (RenderableException.isHttpCode(httpStatus)) {
      this.httpStatus = httpStatus;
    } else if (RenderableException.isHttpCode(code)) {
      this.httpStatus = code;
    }

    if (!location) {
      const stack = new Error().stack?.split('\n')[2]?.trim();
      location = stack || 'Unknown Location';
    }
  }

  /**
   * Check if the code is a valid HTTP status code
   * @param code
   */
  static isHttpCode(code: number): boolean {
    return code >= 100 && code <= 599;
  }

  /**
   * Get the detail
   */
  getDetail(): any {
    return this.detail;
  }

  /**
   * Get the HTTP status code
   */
  getHttpStatus(): number {
    return this.httpStatus;
  }

  /**
   * Get the custom error code
   */
  getCode(): number {
    return this.code; // Return the custom error code
  }

  /**
   * Get the error message
   */
  getErrorMessage(): string {
    return this.errorMessage;
  }

  /**
   * Get the input
   */
  getInput(): string | object {
    return this.input;
  }

  /**
   * Get the error type
   */
  getErrorType(): string {
    return this.errorType;
  }
}
