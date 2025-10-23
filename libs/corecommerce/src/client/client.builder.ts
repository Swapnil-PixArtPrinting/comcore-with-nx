import { Global, Injectable } from '@nestjs/common';
import { ClientBuilder } from '@commercetools/ts-client';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { CoreLoggerService } from '@app/common';
import {
  ClientType,
  ICoreCommerceClientInstance,
  ICoreCommerceDetails,
  ICoreCommerceProviderConfig,
  Workspace,
} from '../config/core-config.interface';
import { dataClient } from '../constants';
import {
  HttpErrorType,
  HttpMiddlewareOptions,
  MiddlewareRequest,
  MiddlewareResponse,
  Next,
} from '@commercetools/ts-client/dist/declarations/src/types/types';
import _ from 'lodash';
import { NetworkException } from '../errors';
import { ClientCreationException } from '../errors/ClientCreationException';

type ErrorHandlerOptions = {
  error: HttpErrorType;
  request: MiddlewareRequest;
};

type ErrorMiddlewareOptions = {
  handler?: (args: ErrorHandlerOptions) => Promise<MiddlewareResponse>;
};

type ConcurrentModificationMiddlewareOptions = {
  concurrentModificationHandlerFn: (
    version: number,
    request: MiddlewareRequest,
    response: MiddlewareResponse,
  ) => Promise<Record<string, any> | string | Buffer>;
};

@Global()
@Injectable()
export class CoreCommerceClientBuilder {
  private coreCommerceClient: ICoreCommerceClientInstance = {};

  constructor(private readonly loggingService: CoreLoggerService) {}

  private async createCommercetoolClient(
    workspace: Workspace,
    configDetails: ICoreCommerceProviderConfig,
  ) {
    const authMiddlewareOptions = {
      host: configDetails.authUrl,
      projectKey: configDetails.projectKey,
      credentials: {
        clientId: configDetails.clientId,
        clientSecret: configDetails.clientSecret,
      },
      httpClient: fetch,
    };

    // Initialize HTTP Middleware
    const httpMiddlewareOptions: HttpMiddlewareOptions = {
      host: configDetails.apiUrl,
      includeResponseHeaders: false,
      includeOriginalRequest: false,
      includeRequestInErrorResponse: true,
      maskSensitiveHeaderData: true,
      enableRetry: true,
      retryConfig: {
        maxRetries: 3,
        retryDelay: 1000,
        retryCodes: [503],
      },
      httpClient: fetch,
    };

    const errorMiddlewareOptions: ErrorMiddlewareOptions = {
      handler: async (args: ErrorHandlerOptions) => {
        const { error, request } = args;
        throw new NetworkException({
          method: error.method,
          message:
            error.message ?? 'An error occurred while processing the request',
          statusCode: error.statusCode || 500,
          originalRequest: request.originalRequest,
          errorDetails: error.details,
          headers: request.headers,
        });
      },
    };

    const concurrentModificationMiddlewareOptions: ConcurrentModificationMiddlewareOptions =
      {
        concurrentModificationHandlerFn: (version, request) => {
          const body = request.body as Record<string, any>;
          this.loggingService.error(
            ['Error'],
            `Concurrent modification error, retry with version ${version}`,
            body,
            body,
          );
          body.version = version;
          return Promise.resolve(body);
        },
      };

    try {
      // Build the Client
      const ctpClient = new ClientBuilder()
        .withConcurrentModificationMiddleware(
          concurrentModificationMiddlewareOptions,
        )
        .withClientCredentialsFlow(authMiddlewareOptions)
        .withHttpMiddleware(httpMiddlewareOptions)
        .withErrorMiddleware(errorMiddlewareOptions)
        .build();

      const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
        projectKey: configDetails.projectKey,
      });

      // Save it in coreCommerceClient
      if (!this.coreCommerceClient[workspace]) {
        this.coreCommerceClient[workspace] = {};
      }

      this.coreCommerceClient[workspace][dataClient.COMMERCETOOL] = {
        client: apiRoot,
      };
      return this.coreCommerceClient;
    } catch (error) {
      console.error('Error creating Commercetool client:', error);
      throw new ClientCreationException(
        `Failed to create Commercetool client for workspace ${workspace}: ${error.message}`,
        error,
      );
    }
  }

  async createClient(coreCommerceConfig: ICoreCommerceDetails) {
    for (const workspaceKey in coreCommerceConfig) {
      const workspaceConfig = coreCommerceConfig?.[workspaceKey] ?? null;

      for (const clientType in workspaceConfig) {
        const configDetails = workspaceConfig[clientType as ClientType];
        switch (clientType) {
          case dataClient.COMMERCETOOL:
            if (configDetails)
              await this.createCommercetoolClient(
                workspaceKey as Workspace,
                configDetails,
              );
            break;
          default:
            throw new Error(`Unsupported client type: ${clientType}`);
        }
      }
    }
    return this.coreCommerceClient;
  }
}
