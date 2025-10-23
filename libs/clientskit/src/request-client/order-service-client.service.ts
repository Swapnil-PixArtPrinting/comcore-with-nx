import { forwardRef, Inject, Injectable, Scope } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  CimpressAuthClient,
  CimpressAuthClientOptions,
} from './cimpress-auth.service';
import {
  LoggingService,
  RedisCacheService,
  WorkspaceService,
} from '@app/common';

@Injectable()
export class OrderServiceClient extends CimpressAuthClient {
  constructor(
    httpService: HttpService,
    @Inject(forwardRef(() => LoggingService))
    loggingService: LoggingService,
    @Inject(forwardRef(() => RedisCacheService))
    redisCacheService: RedisCacheService,
    @Inject('ORDER_SERVICE_AUTH_OPTIONS')
    options: CimpressAuthClientOptions,
    @Inject(forwardRef(() => RedisCacheService))
    private readonly workspaceService: WorkspaceService,
  ) {
    super(httpService, loggingService, redisCacheService, options);

    this.setHeaders({
      Accept: 'application/json',
      workspace: this.workspaceService.getWorkspace(),
    });
  }

  protected parseErrorResponse(responseBody: any): string | null {
    return responseBody?.error ?? null;
  }
}
