import { Injectable, Scope } from '@nestjs/common';
import { IWorkspaceService } from './workspace.interface';

const allowedWorkspaceArr: string[] = ['pixart', 'easyflyer', 'exaprint'];

@Injectable({ scope: Scope.REQUEST })
export class WorkspaceService implements IWorkspaceService {
  private workspace: string | null = null;

  setWorkspace(workspace: string) {
    this.workspace = workspace;
  }

  getWorkspace(): string | null {
    return this.workspace;
  }

  getAllowedWorkspaces(): string[] {
    return allowedWorkspaceArr;
  }

  isAllowedWorkspace(workspace: string): boolean {
    return allowedWorkspaceArr.includes(workspace);
  }
}
