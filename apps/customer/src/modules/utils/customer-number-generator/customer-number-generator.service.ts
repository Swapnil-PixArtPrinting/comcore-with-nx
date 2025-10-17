import {
  TENANT_CONFIG_SERVICE,
  ITenantConfigService,
  WorkspaceService,
} from '@comcore/ocs-lib-common';
import { Inject } from '@nestjs/common';
import { v4 } from 'uuid';

export class CustomerNumberGeneratorService {
  private prefix: string;
  private method: string;

  constructor(
    @Inject(TENANT_CONFIG_SERVICE)
    private readonly tenantConfigService: ITenantConfigService,
    private readonly workspaceService: WorkspaceService,
  ) {}

  async initialize(tenantId: string, store: string) {
    const config = await this.tenantConfigService.get(
      this.workspaceService.getWorkspace(),
      'customerNumberGeneration',
      store,
      tenantId,
    );
    this.prefix = config.prefix;
    this.method = config.method;
  }

  async generate() {
    if (typeof this[this.method] === 'function') {
      return await this[this.method]();
    }
    throw new Error(`Invalid method: ${this.method}`);
  }

  private microtime() {
    return `${this.prefix}-${Math.round(performance.now() * 1000)
      .toString(36)
      .toUpperCase()}`;
  }

  private uuid() {
    return `${this.prefix}${v4().replace(/-/g, 'x')}`;
  }
}
