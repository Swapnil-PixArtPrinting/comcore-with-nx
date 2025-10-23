import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';

// 🔹 Supported client types and workspaces
export type ClientType = 'COMMERCETOOL' | 'ONECOMMERCE';
export type Workspace = 'pixart' | 'easyflyer' | 'exaprint';

// 🔹 Base configuration shared by all providers
export interface IBaseCommerceConfig {
  clientId: string;
  projectKey: string;
  clientSecret: string;
  authUrl: string;
  apiUrl: string;
}

// 🔹 Extended provider config with client type
export interface ICoreCommerceProviderConfig extends IBaseCommerceConfig {}

// 🔹 Alias for initialized Commercetools client
export type CoreCommerceToolClient = ByProjectKeyRequestBuilder;

// 🔹 Wrapper for initialized client instance
export interface ICoreCommerceClientWrapper {
  client: CoreCommerceToolClient;
}

// 🔹 Generic map of client types to values
export type ICoreCommerceClientMap<T> = {
  [K in ClientType]?: T;
};

// 🔹 A workspace may have multiple provider/client entries by client type
export type ICoreCommerceWorkspaceValue =
  ICoreCommerceClientMap<ICoreCommerceProviderConfig>;
export type ICoreCommerceWorkspaceClient =
  ICoreCommerceClientMap<ICoreCommerceClientWrapper>;

// 🔹 Map of workspaces to value
export type ICoreCommerceWorkspaceMap<T> = {
  [workspaceName: string]: T;
};

// 🔹 Final types
export type ICoreCommerceDetails =
  ICoreCommerceWorkspaceMap<ICoreCommerceWorkspaceValue>;
export type ICoreCommerceClientInstance =
  ICoreCommerceWorkspaceMap<ICoreCommerceWorkspaceClient>;
