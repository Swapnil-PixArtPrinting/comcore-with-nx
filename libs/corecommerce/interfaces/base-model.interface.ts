import { CreatedBy, LastModifiedBy } from '@commercetools/platform-sdk';

export interface BaseModel {
  id: string;
  version: number;
  createdAt: string;
  lastModifiedAt: string;
  lastModifiedBy?: LastModifiedBy;
  createdBy?: CreatedBy;
}
