import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerConfigService {

  getLogToFile(): string|undefined {
    return "storage/"+process.env.APP_LOG_FILENAME;
  }

  getAppEnvironment(): string {
    return process.env.APP_ENV || 'local';
  }
}