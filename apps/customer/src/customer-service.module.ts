import { Module } from '@nestjs/common';
import { CustomerServiceController } from './customer-service.controller';
import { CustomerServiceService } from './customer-service.service';
import { CommonModule } from '@app/common';

@Module({
  imports: [CommonModule],
  controllers: [CustomerServiceController],
  providers: [CustomerServiceService],
})
export class CustomerServiceModule {}
