import { ClientRequest } from 'http';

type JsonObject = { [key: string]: any };
type MethodType = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH' | string;

export class NetworkException extends Error {
  method: MethodType;
  statusCode: number;
  originalRequest?: ClientRequest;
  errorDetails?: JsonObject;
  headers?: Record<string, any>;
  [key: string]: any;

  constructor(params: {
    method: MethodType;
    message: string;
    statusCode: number;
    originalRequest?: ClientRequest;
    errorDetails?: JsonObject;
    headers?: Record<string, any>;
    [key: string]: any;
  }) {
    super(params.message);
    this.name = 'NetworkException';
    this.method = params.method;
    this.statusCode = params.statusCode;
    this.originalRequest = params.originalRequest;
    this.errorDetails = params.errorDetails;
    this.headers = params.headers;
    // Assign any additional properties
    Object.keys(params).forEach((key) => {
      if (!(key in this)) {
        this[key] = params[key];
      }
    });
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NetworkException);
    }
  }
}
