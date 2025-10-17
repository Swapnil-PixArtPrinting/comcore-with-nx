import { Injectable } from "@nestjs/common";
import { SmConfigService } from "../config/secrets-manager.config";
import { fromIni } from "@aws-sdk/credential-providers";
import { SSMClient } from "@aws-sdk/client-ssm";
import { SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import {defaultProvider} from "@aws-sdk/credential-provider-node";

@Injectable()
export class SmClientBuilder {
    private ssmClient: any;
    private secretsManagerClient: any;

    constructor(
        private readonly smConfigService: SmConfigService
    ) {
    }

    private buildClient(): void {
        try {
            const awsRegion = this.smConfigService.getAwsRegion();
            const profile = this.smConfigService.getAwsProfile();

            const credentials = profile
                ? fromIni({ profile })
                : defaultProvider();

            this.ssmClient = new SSMClient({
                region: awsRegion,
                credentials
            });

            this.secretsManagerClient = new SecretsManagerClient({
                region: awsRegion,
                credentials
            });

        } catch (error) {
            throw error;
        }
    }

    getSsmClient() {
        if (!this.ssmClient) {
            this.buildClient();
        }
        return this.ssmClient;
    }

    getSecretManagersClient() {
        if( !this.secretsManagerClient) {
            this.buildClient();
        }
        return this.secretsManagerClient;
    }

}