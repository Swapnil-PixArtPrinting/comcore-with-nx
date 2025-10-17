import { CustomerUpdateAction } from "@commercetools/platform-sdk";
import { IsArray, IsNumber, ValidateNested } from "class-validator";

export class UpdateCustomerDto {
    @IsNumber()
    version: number;

    @IsArray()
    @ValidateNested()
    actions: CustomerUpdateAction[];
}