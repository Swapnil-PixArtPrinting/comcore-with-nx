import {
  Address,
  CustomFields,
  GeoJsonPoint,
  LocalizedString,
  ReviewRatingStatistics,
} from '@commercetools/platform-sdk';
import { BaseModel } from '../../../interfaces/base-model.interface';

export interface ChannelModel extends BaseModel {
  key: string;
  roles: string[];
  name?: LocalizedString;
  description?: LocalizedString;
  address?: Address;
  reviewRatingStatistics?: ReviewRatingStatistics;
  custom?: CustomFields;
  geoLocation?: GeoJsonPoint;
}
