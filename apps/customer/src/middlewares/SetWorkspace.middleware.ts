import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WorkspaceService } from '../../../../libs/common/src';

@Injectable()
export class SetWorkspaceMiddleware implements NestMiddleware {
  constructor(private readonly workspaceService: WorkspaceService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const headers = req.headers;
    let workspace = 'pixart';

    if (headers['workspace']) workspace = headers['workspace'] as string;
    if (headers['x-abc-workspace'])
      workspace = (headers['x-abc-workspace'] as string).toLowerCase();

    this.workspaceService.setWorkspace(workspace);
    next();
  }
}
