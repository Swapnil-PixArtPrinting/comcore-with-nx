import { Injectable } from '@nestjs/common';
import { ICommerceCartService } from '../core-cart.service';
import { CommerceCartRepositoryFactory } from '../../providers/core-cart.repo.factory';
import { Cart, CartStateValues } from '@commercetools/platform-sdk';

@Injectable()
export class CommerceCartServiceImpl implements ICommerceCartService {
  constructor(
    private readonly commerceCartRepository: CommerceCartRepositoryFactory,
  ) {}

  /**
   *
   * @param cart
   * @param actions
   * @returns
   */
  async updateCartWithAllActions(
    cart: Cart,
    actions: Array<any>,
  ): Promise<Cart | null> {
    return await this.commerceCartRepository.repository.updateCartWithAllActions(
      cart,
      actions,
    );
  }

  async fetchCartsWhere(
    email?: string,
    customerId?: string,
    page: number = 1,
    pageSize: number = 10,
    cartState: string = CartStateValues.Active,
  ) {
    return await this.commerceCartRepository.repository.fetchCartsWhere(
      email,
      customerId,
      page,
      pageSize,
      cartState,
    );
  }
}
