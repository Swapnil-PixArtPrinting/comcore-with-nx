import { forwardRef, Global, Inject, Injectable } from '@nestjs/common';
import {
    ClientType,
    IBaseCommerceConfig,
    ICoreCommerceClientInstance,
    ICoreCommerceClientWrapper,
    ICoreCommerceDetails,
    Workspace,
} from './core-config.interface';
import { CoreCommerceClientBuilder } from '../client';

@Global()
@Injectable()
export class CoreConfigService {
    private static coreCommerceConfig: ICoreCommerceDetails;
    private static coreCommerceClients: ICoreCommerceClientInstance;

    constructor(
      @Inject(forwardRef(() => CoreCommerceClientBuilder))
      private readonly coreCommerceClientBuilder: CoreCommerceClientBuilder,
    ) {
    }

    /**
     * Set the Core Commerce Config (once)
     */
    async setCoreCommerceConfig(config: ICoreCommerceDetails) {
        CoreConfigService.coreCommerceConfig = config;
    }

    /**
     * Set the Client Instance (once)
     */
    async setCoreCommerceClientInstance() {
        CoreConfigService.coreCommerceClients =
          await this.coreCommerceClientBuilder.createClient(CoreConfigService.coreCommerceConfig);
    }

    /**
     * Get Client Wrapper for specific workspace and client type
     */
    async getCoreCommerceClientInstance(workspace: Workspace, clientType: ClientType): Promise<ICoreCommerceClientWrapper> {
        const workspaceClients = CoreConfigService.coreCommerceClients?.[workspace];

        if (!workspaceClients) {
            throw new Error(`No config found for workspace "${workspace}"`);
        }

        const clientDetails = workspaceClients[clientType];
        if (!clientDetails) {
            throw new Error(`No client found for client "${clientType}" in workspace "${workspace}"`);
        }

        return clientDetails;
    }

    /**
     * Get Config Details for a specific workspace and client
     */
    async getCoreCommerceConfigDetails(workspace: Workspace, clientType: ClientType): Promise<IBaseCommerceConfig> {
        const workspaceConfig = CoreConfigService.coreCommerceConfig?.[workspace];

        if (!workspaceConfig) {
            throw new Error(`No config found for workspace "${workspace}"`);
        }

        const clientConfig = workspaceConfig[clientType];
        if (!clientConfig) {
            throw new Error(`No config found for client "${clientType}" in workspace "${workspace}"`);
        }

        return clientConfig;
    }
}