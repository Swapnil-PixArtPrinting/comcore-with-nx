import { Module } from "@nestjs/common";
import { CustomJwtService } from "./custom-jwt.service";
import { TenantConfigModule } from "../workspace-configuration";

@Module({
    imports: [TenantConfigModule],
    providers: [CustomJwtService],
    exports: [CustomJwtService]
})
export class CustomJwtModule {
}