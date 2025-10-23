import { Controller, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { API_V3_BASE_PATH } from '../constant/api.constants';

@Controller(API_V3_BASE_PATH)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('health-check')
  getHello(): string {
    return this.orderService.getHello();
  }
}
