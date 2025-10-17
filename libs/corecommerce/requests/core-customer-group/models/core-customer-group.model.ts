import {
    CustomFields,
} from "@commercetools/platform-sdk";
import { BaseModel } from '../../../../../corecommerce/src/interfaces/base-model.interface';

export interface CustomerGroupModel extends BaseModel {
    key?: string;
    name: string;
    custom?: CustomFields;
}
