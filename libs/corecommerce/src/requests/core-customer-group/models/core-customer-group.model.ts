import { CustomFields } from '@commercetools/platform-sdk';
import { BaseModel } from '../../../interfaces';

export interface CustomerGroupModel extends BaseModel {
  key?: string;
  name: string;
  custom?: CustomFields;
}
