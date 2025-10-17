import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import {
  LoggerModule,
  WorkspaceModule,
  RedisCacheModule,
} from '../../../common/src';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HttpModule,
    WorkspaceModule,
    LoggerModule,
    RedisCacheModule,
    ConfigModule,
  ],
  providers: [],
  exports: [],
})
export class RequestClientModule {}
