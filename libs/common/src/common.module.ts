import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { WorkspaceConfigurationModule } from './workspace-configuration';
import { LoggerModule } from './logger';
import { ExecutionProfilerModule } from './execution-profiler';
import { CustomJwtModule } from './jwt';
import { TrustSuiteModule } from './trust-suite';
import { RedisCacheModule } from './redis-cache';

@Module({
  imports: [
    WorkspaceConfigurationModule,
    LoggerModule,
    ExecutionProfilerModule,
    CustomJwtModule,
    TrustSuiteModule,
    RedisCacheModule,
  ],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
