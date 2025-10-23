import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import ExtendedRequest from '../interfaces/extended-request.interface';

@Injectable({ scope: Scope.REQUEST })
export class HttpContextService {
  constructor(@Inject(REQUEST) private readonly request: ExtendedRequest) {}
  getRequest(): ExtendedRequest {
    return this.request;
  }
}
