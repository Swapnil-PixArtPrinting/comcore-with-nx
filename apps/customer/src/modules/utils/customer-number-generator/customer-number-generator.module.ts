import { Module } from '@nestjs/common';
import { CustomerNumberGeneratorService } from './customer-number-generator.service';
import { WorkspaceModule, TenantConfigModule } from '@comcore/ocs-lib-common';

@Module({
  imports: [WorkspaceModule, TenantConfigModule],
  providers: [CustomerNumberGeneratorService],
  exports: [CustomerNumberGeneratorService],
})
export class CustomerNumberGeneratorModule {}
