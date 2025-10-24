import { BaseResponse } from './base.response';

/**
 * FailureResponse extends BaseResponse to represent error responses.
 */
export class FailureResponse extends BaseResponse {
  private readonly error: {
    message: string;
    detail?: string;
    error_code?: number;
    type?: string;
  };

  /**
   * Constructs a new FailureResponse instance.
   * @param message - Descriptive error message.
   * @param statusCode - HTTP status code for the error response.
   * @param detail - Additional details about the error (optional).
   * @param errorCode - Custom error code for further classification (optional).
   * @param errorType - Type/category of the error (optional).
   * @param meta - Additional metadata for the response (optional, defaults to an empty object).
   */
  constructor(
    message: string,
    statusCode: number,
    detail?: any,
    errorCode?: number,
    errorType?: string,
    meta: Record<string, any> = {},
  ) {
    super(false, statusCode, meta);
    this.error = {
      message,
      detail,
      error_code: errorCode,
      type: errorType,
    };
  }
}
