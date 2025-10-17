import { Module } from '@nestjs/common';
import { TenantConfigServiceImpl } from './services/implementations/tenant-config.service.impl';
import { TENANT_CONFIG_SERVICE } from './services/tenant-config.service.interface';
import { TenantConfigRepoImpl } from './repositories/implementations/tenant-config.repo.impl';
import { TENANT_CONFIG_REPO } from './repositories/tenant-config.repo.interface';

@Module({
    imports: [],
    providers: [
        {
            useClass: TenantConfigServiceImpl,
            provide: TENANT_CONFIG_SERVICE
        },
        {
            useClass: TenantConfigRepoImpl,
            provide: TENANT_CONFIG_REPO
        }
    ],
    exports: [TENANT_CONFIG_SERVICE, TENANT_CONFIG_REPO]
})
export class TenantConfigModule {}