export interface IWorkspaceService {
  setWorkspace(workspace: string): void;
  getWorkspace(): string | null;
}
