import { Module } from '@nestjs/common';
import { LoggingService } from './services/logging.service';
import { RedactorService } from './services/redactor.service';
import { LoggerConfigService } from './config/logger.config';
import { HttpContextService } from './services/http-context.service';
import { CoreLoggerService } from './services/core-logger.service';

@Module({
  imports: [],
  providers: [
    LoggingService,
    HttpContextService,
    RedactorService,
    LoggerConfigService,
    CoreLoggerService,
  ],
  exports: [
    LoggingService,
    HttpContextService,
    RedactorService,
    LoggerConfigService,
    CoreLoggerService,
  ],
})
export class LoggerModule {}
