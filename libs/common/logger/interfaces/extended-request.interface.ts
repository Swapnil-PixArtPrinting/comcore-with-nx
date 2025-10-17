import { Request } from 'express';

interface ExtendedRequest extends Request {
  workspace: string;
  workspaceEnv: string;
  store: string;
  channel: string;
  jwtEmail: string;
}

export default ExtendedRequest;