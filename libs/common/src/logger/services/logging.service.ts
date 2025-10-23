import { Injectable, Scope } from '@nestjs/common';
import * as winston from 'winston';
import { HttpContextService } from './http-context.service';
import { RedactorService } from './redactor.service';
import ExtendedRequest from '../interfaces/extended-request.interface';
import { LogLevel } from '../enums/log-level.enum';
import { LoggerConfigService } from '../config/logger.config';
import { LogContext, LogEntry } from '../interfaces/log.interface';

@Injectable({ scope: Scope.REQUEST })
export class LoggingService {
  private logger: winston.Logger;

  private readonly restrictedData = ['password'];
  private readonly personalData = ['phone'];

  constructor(
    private readonly httpContextProvider: HttpContextService,
    private readonly redactorService: RedactorService,
    private readonly loggerConfigService: LoggerConfigService,
  ) {
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

  private getLogEntry() {
    const request: ExtendedRequest = this.httpContextProvider.getRequest();

    return {
      remote_addr: request?.ip ?? null,
      hostname: request?.hostname ?? null,
      method: request?.method ?? null,
      url: request?.originalUrl ?? null,
      referrer:
        (request?.headers?.referrer as string | undefined) ??
        request?.headers?.referer ??
        null,
      user_agent: request?.headers?.['user-agent'] ?? null,
      workspace: Array.isArray(request?.headers?.['workspace'])
        ? request?.headers?.['workspace'][0]
        : (request?.headers?.['workspace'] ?? 'pixart'),
      workspaceEnv: this.loggerConfigService.getAppEnvironment(),
      store: Array.isArray(request?.headers?.['store'])
        ? request?.headers?.['store'][0]
        : (request?.headers?.['store'] ?? null),
      channel: Array.isArray(request?.headers?.['channel'])
        ? request?.headers?.['channel'][0]
        : (request?.headers?.['channel'] ?? null),
      jwtEmail: Array.isArray(request?.headers?.['emailOfRequestBy'])
        ? request?.headers?.['emailOfRequestBy'][0]
        : (request?.headers?.['emailOfRequestBy'] ?? null),
    };
  }

  private filterDetails(details: any) {
    if (!details) return details;

    return this.redactorService.redactMultiple(details, [
      ...this.restrictedData.map((key) => ({
        key,
        action: 'delete' as const,
      })),
      ...this.personalData.map((key) => ({
        key,
        action: 'mask' as const,
        options: { strategy: 'default' as const },
      })),
    ]);
  }

  private log(
    level: string,
    tags: any,
    message: any,
    details: any,
    trace?: any,
  ) {
    const context = this.getLogEntry();
    const logContext: LogContext = {
      ...context,
      details: this.filterDetails(details),
    };
    const logData: LogEntry = {
      message,
      timestamp: new Date().toISOString(),
      level,
      tags,
      context: logContext,
    };

    if (trace) logData.trace = trace;

    const orderedLogData = {
      message: logData.message,
      context: logData.context,
      level: logData.level,
      tags: logData.tags,
      timestamp: logData.timestamp,
      ...(logData.trace && { trace: logData.trace }),
    };

    this.logger.log(level, orderedLogData);
  }

  error(
    tags: string[],
    message: string,
    details: Record<string, any>,
    trace: Record<string, any>,
  ) {
    this.log(LogLevel.ERROR, tags, message, details, trace);
  }

  warn(tags: string[], message: string, details: Record<string, any>) {
    this.log(LogLevel.WARN, tags, message, details);
  }

  info(tags: string[], message: string, details?: Record<string, any>) {
    this.log(LogLevel.INFO, tags, message, details);
  }

  debug(tags: string[], message: string, details?: Record<string, any>) {
    this.log(LogLevel.DEBUG, tags, message, details);
  }
}
