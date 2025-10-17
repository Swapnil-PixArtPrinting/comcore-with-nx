import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { WorkspaceService } from '@comcore/ocs-lib-common';
import {
  CoreClientService,
  CoreConfigService,
} from '@comcore/ocs-lib-corecommerce';

/**
 * WorkerHostProcessor is an abstract class that extends WorkerHost.
 * It listens to various worker events and logs job details accordingly.
 */
export abstract class WorkerHostProcessor extends WorkerHost {
  protected constructor(
    protected readonly moduleRef: ModuleRef,
    protected readonly workspaceService: WorkspaceService,
    protected readonly coreConfigService: CoreConfigService,
    protected readonly coreClientService: CoreClientService,
  ) {
    super();
  }

  /**
   * Resolves and injects request-scoped versions of already injected services.
   */
  protected async resolveAndInjectScopedServices(job: Job) {
    if (this.workspaceService?.setWorkspace) {
      const workspace = job.data?.workspace;
      if (workspace) {
        this.workspaceService.setWorkspace(workspace);
      }

      const client = await this.coreConfigService.getCoreCommerceClientInstance(
        this.workspaceService.getWorkspace(),
        'COMMERCETOOL',
      );
      this.coreClientService.setClient(client.client);
      this.coreClientService.setDataClient('COMMERCETOOL');
    }

    const contextId = ContextIdFactory.create();
    // Iterate over all keys injected via constructor
    for (const key of Object.keys(this)) {
      const original = this[key];
      try {
        this[key] = await this.moduleRef.resolve(
          original.constructor,
          contextId,
          {
            strict: false,
          },
        );
      } catch {
        // Skip if not resolvable
      }
    }
  }
}
