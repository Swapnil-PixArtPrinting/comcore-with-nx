import { BaseResponse } from './base.response';

/**
 * SuccessResponse extends BaseResponse to represent successful API responses.
 */
export class SuccessResponse extends BaseResponse {
  private readonly message: string;
  private readonly data: any;

  /**
   * Constructs a new SuccessResponse instance.
   * @param message - Descriptive message for the success response.
   * @param statusCode - HTTP status code for the response.
   * @param data - Response data payload (optional, defaults to an empty object).
   * @param meta - Additional metadata for the response (optional, defaults to an empty object).
   */
  constructor(message: string, statusCode: number, data: any = {}, meta: Record<string, any> = {}) {
    super(true, statusCode, meta); // Calls BaseResponse constructor with success=true
    this.message = message;
    this.data = data;
  }
}
