import { Controller, Get } from '@nestjs/common';
import { CartService } from './cart.service';
import { API_V2_BASE_PATH } from '../constant/api.constants';

@Controller(API_V2_BASE_PATH)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('health-check')
  getHello(): string {
    return this.cartService.getHello();
  }
}
