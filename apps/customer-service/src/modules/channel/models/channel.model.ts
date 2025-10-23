import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { ChannelModel } from '@app/corecommerce';

export class ChannelReferenceModel {
  @IsString()
  typeId: 'channel';

  @IsString()
  id: string;

  @IsOptional()
  @ValidateNested()
  obj?: ChannelModel;
}
