import { Injectable, Global } from '@nestjs/common';
import {
    ICoreCommerceDetails,
} from './core-commerce-config.interface';
import { CoreCommerceWorkspaceConfigDetails } from './core-commerce-config.enum';

@Global() // Ensures it's available across the app
@Injectable()
export class CoreCommerceConfigService {
    private static instance: CoreCommerceConfigService;
    private coreCommerceWorkspaceConfigDetails: ICoreCommerceDetails;

    constructor() {
        if (!CoreCommerceConfigService.instance) {
            CoreCommerceConfigService.instance = this;
        }
        return CoreCommerceConfigService.instance;
    }

    /**
     *
     * @param coreCommerceWorkspaceConfigDetails
     */
    setCoreCommerceConfig(coreCommerceWorkspaceConfigDetails: ICoreCommerceDetails) {
        this.coreCommerceWorkspaceConfigDetails = coreCommerceWorkspaceConfigDetails;
    }

    /**
     *
     * @returns
     */
    getCoreCommerceConfig(): ICoreCommerceDetails {
        return CoreCommerceWorkspaceConfigDetails;
    }
}