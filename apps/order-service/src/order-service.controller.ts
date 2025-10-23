import { Controller, Get } from '@nestjs/common';
import { OrderServiceService } from './order-service.service';

@Controller('carts')
export class OrderServiceController {
  constructor(private readonly orderServiceService: OrderServiceService) {}

  @Get()
  getHello(): string {
    return this.orderServiceService.getHello();
  }
}
