import { Module } from '@nestjs/common';
import { CustomerNumberGeneratorService } from './customer-number-generator.service';
import { WorkspaceModule, TenantConfigModule } from '@app/common';

@Module({
  imports: [WorkspaceModule, TenantConfigModule],
  providers: [CustomerNumberGeneratorService],
  exports: [CustomerNumberGeneratorService],
})
export class CustomerNumberGeneratorModule {}
