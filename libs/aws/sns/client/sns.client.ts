import { Injectable } from "@nestjs/common";
import { SNSClient } from "@aws-sdk/client-sns";
import { fromIni } from "@aws-sdk/credential-providers";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { SnsConfigService } from "../config/sns.config";

@Injectable()
export class SnsClientBuilder {
    private snsClient: SNSClient | null = null;

    constructor(private readonly snsConfigService: SnsConfigService) {}

    private buildClient(): SNSClient {
        try {
            const region = this.snsConfigService.getAwsSnsRegion();
            const profile = this.snsConfigService.getAwsProfile();
    
            const credentials = profile
                ? fromIni({ profile })
                : defaultProvider();
    
            return new SNSClient({
                region,
                credentials
            });
        } catch (error) {
            throw error;
        }
    }

    getSnsClient(): SNSClient {
        if (!this.snsClient) {
            this.snsClient = this.buildClient();
        }
        return this.snsClient;
    }

    refreshClient(): SNSClient {
        this.snsClient = this.buildClient();
        return this.snsClient;
    }
}