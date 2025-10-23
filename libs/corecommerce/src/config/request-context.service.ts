import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { allowedHeaders } from '../constants/request.enum';

@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  getHeaders(): Record<string, string> {
    const result: Record<string, string> = {};

    if (this.request.headers) {
      for (const key in allowedHeaders) {
        const headerValue = this.request.headers[key];
        if (headerValue) {
          result[allowedHeaders[key]] = Array.isArray(headerValue)
            ? headerValue[0]
            : headerValue.toString();
        }
      }
    }

    return result;
  }
}
