// 🔹 Define all supported client types
export type ClientType = 'COMMERCETOOL' | 'ONECOMMERCE'; // Add more if needed

// 🔹 Base configuration shared by all providers
export interface IBaseCommerceConfig {
    clientId: string;
    projectKey: string;
    clientSecret: string;
    authUrl: string;
    apiUrl: string;
}

// 🔹 Extended provider config with client type
export interface ICoreCommerceProviderConfig extends IBaseCommerceConfig {
}

// 🔹 Allow a workspace to either have:
//    a) one provider config (single-provider mode)
//    b) multiple providers (multi-provider mode)
export type CoreCommerceWorkspaceValueType =
  | ICoreCommerceProviderConfig
  | Partial<Record<ClientType, ICoreCommerceProviderConfig>>;

// 🔹 Workspace-level configuration supporting both modes
export interface ICoreCommerceDetails {
    [workspaceName: string]: CoreCommerceWorkspaceValueType;
}