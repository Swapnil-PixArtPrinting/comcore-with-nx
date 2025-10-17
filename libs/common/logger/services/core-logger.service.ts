import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import { LoggerConfigService } from '../config/logger.config';
import { LogLevel } from '../enums/log-level.enum';
import { LogEntry } from '../interfaces/log.interface';

@Injectable()
export class CoreLoggerService {
  private readonly logger: winston.Logger;

  constructor(private readonly loggerConfigService: LoggerConfigService) {
    const isLocal = this.loggerConfigService.getAppEnvironment() === 'local';
    const logLevel = isLocal ? 'debug' : 'info';

    const orderedJsonFormat = winston.format.printf(
      ({ message, context, level, tags, timestamp, trace }) => {
        const orderedLogData: Record<string, any> = {
          message,
          context,
          level,
          tags,
          timestamp,
        };
        if (trace) {
          orderedLogData.trace = trace;
        }
        return JSON.stringify(orderedLogData);
      },
    );

    const transports: winston.transport[] = [];
    if (isLocal) {
      transports.push(
        new winston.transports.File({
          filename: this.loggerConfigService.getLogToFile(),
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            orderedJsonFormat,
          ),
        }),
      );
    } else {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            orderedJsonFormat,
          ),
        }),
      );
    }

    this.logger = winston.createLogger({
      level: logLevel,
      transports,
    });
  }

  // A helper method to handle the logging logic
  private log(
    level: string,
    tags: string[],
    message: string,
    details?: Record<string, any>,
    trace?: any,
  ) {
    const logData: LogEntry = {
      message,
      timestamp: new Date().toISOString(),
      level,
      tags,
      context: { details },
    };

    if (trace) logData.trace = trace;

    this.logger.log(level, logData);
  }

  // Public logging methods that directly use the private logger
  info(tags: string[], message: string, details?: Record<string, any>) {
    this.log(LogLevel.INFO, tags, message, details);
  }

  warn(tags: string[], message: string, details?: Record<string, any>) {
    this.log(LogLevel.WARN, tags, message, details);
  }

  error(
    tags: string[],
    message: string,
    details?: Record<string, any>,
    trace?: Record<string, any>,
  ) {
    this.log(LogLevel.ERROR, tags, message, details, trace);
  }

  debug(tags: string[], message: string, details?: Record<string, any>) {
    this.log(LogLevel.DEBUG, tags, message, details);
  }
}
