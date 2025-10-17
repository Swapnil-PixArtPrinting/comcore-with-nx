import { Cart, CartUpdateAction } from '@commercetools/platform-sdk';

export const COMMERCE_CART_REPOSITORY = 'COMMERCE_CART_REPOSITORY';

export interface ICommerceCartRepository {
  /**
   *
   * @param cart
   * @param actions
   */
  updateCartWithAllActions(
    cart: Cart,
    actions: Array<CartUpdateAction>,
  ): Promise<Cart | null>;

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
  ): Promise<{ carts: Cart[]; total: number }>;
}
