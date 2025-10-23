import { Module } from '@nestjs/common';
import { ExecutionProfiler } from './execution-profiler.service';

@Module({
  providers: [ExecutionProfiler],
  exports: [ExecutionProfiler],
})
export class ExecutionProfilerModule {}
