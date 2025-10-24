import { Response } from 'express';

/**
 * BaseResponse class provides a standard structure for API responses.
 */
export class BaseResponse {
  private readonly success: boolean;
  private readonly statusCode: number;
  private readonly meta?: Record<string, any>;

  /**
   * Constructs a new BaseResponse instance.
   * @param success - Indicates whether the request was successful.
   * @param statusCode - HTTP status code for the response.
   * @param meta - Additional metadata for the response (optional).
   */
  constructor(
    success: boolean,
    statusCode: number,
    meta: Record<string, any> = {},
  ) {
    this.success = success;
    this.statusCode = statusCode;
    this.meta = {
      timestamp: new Date().toISOString(),
      ...meta,
    };
  }

  /**
   * Sends the response using the Express Response object.
   * @param res - Express Response object.
   */
  send(res: Response): void {
    res.status(this.statusCode).json(this); // Sends the response as JSON
  }

  /**
   * Returns the success status of the response.
   * @returns {boolean} - True if the response indicates success, false otherwise.
   */
  public getSuccess(): boolean {
    return this.success;
  }

  /**
   * Returns the metadata of the response.
   * @returns {Record<string, any>} - Metadata object containing additional response details.
   */
  public getMeta(): Record<string, any> {
    return this.meta;
  }
}
