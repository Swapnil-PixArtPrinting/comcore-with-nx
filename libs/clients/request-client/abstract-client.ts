import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosRequestConfig, AxiosError } from 'axios';
import { LoggingService } from '../../../common/src/logger/services/logging.service';
import { StatusCodeDescription } from './http-status-description';

export abstract class AbstractClient {
  protected tokenCacheKey: string | null = null;
  protected name: string;
  protected headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  protected authType: string;
  protected clientId: string | null = null;
  protected clientSecret: string;

  constructor(
    protected readonly httpService: HttpService,
    protected readonly loggingService: LoggingService,
    inputName: string,
    authType: string = 'OAuth2.0',
  ) {
    this.name = inputName;
    this.authType = authType;

    if (authType === 'OAuth2.0') {
      this.tokenCacheKey = this.clientId
        ? `${this.clientId}_access_token`
        : `${inputName}_http_client_token`;
    }
  }

  protected abstract getToken(noCache?: boolean): Promise<string>;
  protected abstract parseErrorResponse(responseBody: any): string | null;

  async request(
    url: string,
    body: Record<string, any> | null,
    defaultErrorMsg: string,
    method: 'get' | 'post' | 'put' | 'patch' | 'delete' = 'post',
    attempt = 0,
  ): Promise<any> {
    if (this.authType) {
      await this.setTokenHeader();
    }

    const logHeaders = { ...this.headers };
    if (logHeaders['Authorization']) {
      logHeaders['Authorization'] =
        logHeaders['Authorization'].length.toString();
    }

    const axiosConfig: AxiosRequestConfig = {
      headers: this.getHeaders(),
    };

    if (body) {
      axiosConfig.data = body;
    }

    try {
      const requestBody = { ...(body || {}) };

      this.loggingService.debug(
        ['AbstractClient'],
        `${this.name}.request.body`,
        {
          method,
          url,
          body: requestBody,
          headers: logHeaders,
        },
      );

      const response = await lastValueFrom(
        this.httpService.request({
          url,
          method,
          ...axiosConfig,
        }),
      );

      const responseData =
        typeof response.data === 'object'
          ? response.data
          : JSON.parse(response.data);

      this.loggingService.debug(
        ['AbstractClient'],
        `${this.name}.response.body`,
        {
          body: responseData,
        },
      );

      if (responseData?.error) {
        throw new Error(
          responseData?.message
            ? `message: ${responseData.message}`
            : defaultErrorMsg,
        );
      }

      return responseData;
    } catch (error: any) {
      const axiosError = error as AxiosError;
      const request = axiosError?.config;
      const response = axiosError?.response;
      let message = axiosError?.message;
      let responseBody: any = null;

      if (response) {
        try {
          responseBody = response.data;
          const parsed = this.parseErrorResponse(responseBody);
          if (parsed) message = parsed;
        } catch {}
      }

      let requestBody = body ?? {};
      if (typeof requestBody === 'string') {
        try {
          requestBody = JSON.parse(requestBody);
        } catch {}
      }

      let errorLabel = 'Unknown';
      if (!responseBody && StatusCodeDescription[`${axiosError?.code}`]) {
        errorLabel = StatusCodeDescription[`${axiosError?.code}`];
      } else {
        if (responseBody?.status) errorLabel = responseBody.status;
        if (typeof responseBody?.error === 'string') {
          errorLabel += ` ${responseBody.error}`;
        }
      }

      this.loggingService.error(
        ['AbstractClient'],
        `${this.name}-client.response.error`,
        {
          endpoint: `${request?.method?.toUpperCase()} ${request?.url}`,
          requestBody,
          requestHeaders: logHeaders,
          responseStatusCode: response?.status,
          responseMessage: message,
          responseBody,
          errorLabel,
        },
        error,
      );

      const isAuthError =
        response?.status === 401 && /token|auth/i.test(message || '');

      if (isAuthError && attempt < 2) {
        await this.setTokenHeader(true);
        return this.request(url, body, defaultErrorMsg, method, attempt + 1);
      } else {
        throw error;
      }
    }
  }

  public getHeaders(): Record<string, string> {
    return this.headers;
  }

  public setHeaders(headers: Record<string, string>): void {
    this.headers = {
      ...this.headers,
      ...headers,
    };
  }

  public async setTokenHeader(noCache = false): Promise<void> {
    const token = await this.getToken(noCache);
    this.setHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
