import { Module } from '@nestjs/common';
import { SecretsManagerServiceImpl } from './services/implementations/secrets-manager.service.impl';
import { SECRETS_MANAGER_SERVICE } from './services/secrets-manager.service.interface';
import { SmConfigService } from './config';
import { SmClientBuilder } from './client';

@Module({
    imports: [],
    providers: [
        {
            useClass: SecretsManagerServiceImpl,
            provide: SECRETS_MANAGER_SERVICE
        },
        SmConfigService,
        SmClientBuilder
    ],
    exports: [SECRETS_MANAGER_SERVICE, SmConfigService, SmClientBuilder]
})
export class SecretsManagerModule {}
