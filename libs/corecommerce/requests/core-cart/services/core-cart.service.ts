import { Cart, CartUpdateAction } from '@commercetools/platform-sdk';

export const COMMERCE_CART_SERVICE = 'COMMERCE_CART_SERVICE';

export interface ICommerceCartService {
  /**
   *
   * @param cart
   * @param actions
   */
  updateCartWithAllActions(
    cart: Cart,
    actions: Array<CartUpdateAction>,
  ): Promise<any>;

  /**
   *
   * @param email
   * @param page
   * @param pageSize
   */
  fetchCartsWhere(
    email?: string,
    customerId?: string,
    page?: number,
    pageSize?: number,
    cartState?: string,
  ): any;
}
