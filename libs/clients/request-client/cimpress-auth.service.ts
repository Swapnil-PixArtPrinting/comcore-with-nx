import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AbstractClient } from './abstract-client';
import { LoggingService, RedisCacheService } from '../../../common/src';

export interface CimpressAuthClientOptions {
  clientId: string;
  clientSecret: string;
  audience: string;
  appKey: string;
  tokenUrl: string;
  name: string;
}

interface TokenRequestPayload {
  client_id: string;
  client_secret: string;
  audience: string;
  cookieSecret: string;
  grant_type: string;
}

@Injectable()
export class CimpressAuthClient extends AbstractClient {
  protected readonly clientId: string;
  protected readonly clientSecret: string;
  protected readonly audience: string;
  protected readonly appKey: string;
  protected readonly tokenUrl: string;

  constructor(
    httpService: HttpService,
    loggingService: LoggingService,
    @Inject(RedisCacheService)
    private readonly redisCacheService: RedisCacheService,
    @Inject('CIMPRESS_AUTH_OPTIONS')
    private readonly options: CimpressAuthClientOptions,
  ) {
    super(httpService, loggingService, `${options.name}-cimpress`);

    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.audience = options.audience;
    this.appKey = options.appKey;
    this.tokenUrl = options.tokenUrl;

    this.tokenCacheKey = this.clientId
      ? `${this.clientId}_access_token`
      : `${options.name}_http_client_token`;

    this.setHeaders({
      Accept: 'application/json',
    });
  }

  protected async getToken(noCache = false): Promise<string> {
    const cachedToken = noCache
      ? null
      : await this.redisCacheService.get<string>(this.tokenCacheKey as string);
    if (cachedToken) return cachedToken;

    const body: TokenRequestPayload = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      audience: this.audience,
      cookieSecret: this.appKey,
      grant_type: 'client_credentials',
    };

    const response = await this.httpService.axiosRef.post(this.tokenUrl, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = response.data;
    const token = responseData.access_token;
    const expiry = Math.floor(responseData.expires_in / 60) - 4;

    this.loggingService.info(
      ['CimpressAuthClient'],
      `Cached ${this.name} token`,
      {
        key: this.tokenCacheKey,
        expires_in: responseData.expires_in,
        expiry,
      },
    );

    if (expiry > 0) {
      await this.redisCacheService.set(
        this.tokenCacheKey as string,
        token,
        expiry * 60 * 1000,
      );
    }

    return token;
  }

  protected parseErrorResponse(responseBody: any): string | null {
    return responseBody?.error ?? null;
  }
}
