import { Injectable, Scope } from '@nestjs/common';
import { CoreCommerceToolClient } from './core-config.interface';

@Injectable({ scope: Scope.REQUEST })
export class CoreClientService {
  private coreCommerceClient: CoreCommerceToolClient;
  private dataCient: string;

  constructor() {}

  /**
   * Set the Core Commerce Config (once)
   */
  getClient(): CoreCommerceToolClient {
    return this.coreCommerceClient;
  }

  setClient(coreCommerceClient: CoreCommerceToolClient): void {
    this.coreCommerceClient = coreCommerceClient;
  }

  getDataClient(): string {
    return this.dataCient;
  }

  setDataClient(dataClient: string): void {
    this.dataCient = dataClient;
  }
}
