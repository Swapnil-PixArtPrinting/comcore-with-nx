export const SECRETS_MANAGER_SERVICE = "SECRETS_MANAGER_SERVICE";

export interface ISecretsManagerServiceInterface {
    getParams(path: string)

    fetchParams(appPath: string, env?: string)

    normalizeParameterName(path: string, name: string): string

    fetchSecretManagerData(env?: string)
}