import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { RequestClientModule } from './request-client';

@Module({
  imports: [RequestClientModule],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
