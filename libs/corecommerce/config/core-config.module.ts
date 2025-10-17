import { Module, forwardRef, Global } from '@nestjs/common';
import { CoreConfigService } from './core-config.service';
import { ClientModule } from '../client';
import { CoreClientService } from './core-client.service';
import { RequestContextService } from './request-context.service';

@Global()
@Module({
  imports: [
    forwardRef(() => ClientModule),
  ],
  providers: [CoreConfigService, CoreClientService, RequestContextService],
  exports: [CoreConfigService, CoreClientService, RequestContextService]
})
export class CoreConfigModule {}