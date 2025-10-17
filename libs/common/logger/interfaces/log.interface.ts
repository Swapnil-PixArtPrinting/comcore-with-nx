export interface LogContext {
  remote_addr: string | null;
  hostname: string | null;
  method: string | null;
  url: string | null;
  referrer: string | null;
  user_agent: string | null;
  workspace: string;
  workspaceEnv: string;
  store: string | null;
  channel: string | null;
  jwtEmail: string | null;
  details?: Record<string, any>;
}

export interface LogEntry {
  message: string;
  context: LogContext | Record<string, any>;
  level: string;
  tags: string[];
  timestamp: string; // ISO format or formatted with 'YYYY-MM-DD HH:mm:ss'
  trace?: Record<string, any>; // Optional, used mainly for errors
}
