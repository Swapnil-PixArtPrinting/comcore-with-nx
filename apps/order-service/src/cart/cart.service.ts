import { Injectable } from '@nestjs/common';

@Injectable()
export class CartService {
  getHello(): string {
    return 'This is Cart Service!';
  }
}
