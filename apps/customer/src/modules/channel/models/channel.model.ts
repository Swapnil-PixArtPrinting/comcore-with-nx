import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { ChannelModel } from '@comcore/ocs-lib-corecommerce';

export class ChannelReferenceModel {
  @IsString()
  typeId: 'channel';

  @IsString()
  id: string;

  @IsOptional()
  @ValidateNested()
  obj?: ChannelModel;
}
