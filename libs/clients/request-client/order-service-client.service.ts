import { Inject, Injectable, Scope } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CimpressAuthClient } from './cimpress-auth.service';
import type { CimpressAuthClientOptions } from './cimpress-auth.service';
import {
  LoggingService,
  RedisCacheService,
  WorkspaceService,
} from '../../../common/src';

@Injectable({ scope: Scope.REQUEST })
export class OrderServiceClient extends CimpressAuthClient {
  constructor(
    httpService: HttpService,
    loggingService: LoggingService,
    @Inject(RedisCacheService)
    redisCacheService: RedisCacheService,
    @Inject('ORDER_SERVICE_AUTH_OPTIONS')
    options: CimpressAuthClientOptions,
    private readonly workspaceService: WorkspaceService,
  ) {
    super(httpService, loggingService, redisCacheService, options);

    this.setHeaders({
      Accept: 'application/json',
      workspace: this.workspaceService.getWorkspace() as string,
    });
  }

  protected parseErrorResponse(responseBody: any): string | null {
    return responseBody?.error ?? null;
  }
}
