import { Module } from '@nestjs/common';
import { WorkspaceConfigurationService } from './workspace-configuration.service';
import {
    CoreCommerceConfigModule
} from "./src/core-commerce-config/core-commerce-config.module";
import {EnvConfigModule} from "./src/env-config/env-config.module";

@Module({
    providers: [WorkspaceConfigurationService],
    exports: [WorkspaceConfigurationService],
    imports: [CoreCommerceConfigModule, EnvConfigModule],
})
export class WorkspaceConfigurationModule {}