import { Injectable } from '@nestjs/common';
import { ICommerceCartRepository } from '../core-cart.repo';
import { CoreClientService } from '../../../../config';
import {
  Cart,
  CartUpdateAction,
  CartUpdate,
} from '@commercetools/platform-sdk';
import { RequestContextService } from '../../../../config/request-context.service';

@Injectable()
export class CommercetoolCartRepository implements ICommerceCartRepository {
  constructor(
    private readonly coreClientService: CoreClientService,
    private readonly requestContextService: RequestContextService,
  ) {}

  /**
   *
   * @param cart
   * @param actions
   */
  async updateCartWithAllActions(
    cart: Cart,
    actions: Array<CartUpdateAction>,
  ): Promise<Cart | null> {
    try {
      const headers = this.requestContextService.getHeaders();

      const cartUpdate: CartUpdate = {
        version: cart.version,
        actions,
      };

      const response = await this.coreClientService
        .getClient()
        .carts()
        .withId({ ID: cart.id })
        .post({
          body: cartUpdate,
          headers: headers,
        })
        .execute();

      return response.body && Object.keys(response.body).length > 0
        ? response.body
        : null;
    } catch (error) {
      const concurrentError = error?.body?.errors?.find(
        (err: { code: string }) => err.code === 'ConcurrentModification',
      );
      if (concurrentError && concurrentError.currentVersion) {
        const updatedCart = {
          ...cart,
          version: concurrentError.currentVersion,
        };
        return await this.updateCartWithAllActions(updatedCart, actions);
      }
    }
    return null;
  }

  async fetchCartsWhere(
    email?: string,
    customerId?: string,
    page: number = 1,
    pageSize: number = 10,
    cartState: string = 'Active',
  ): Promise<{ carts: Cart[]; total: number }> {
    const offset = (page - 1) * pageSize;

    let whereClause = `cartState="${cartState}"`;

    if (customerId) {
      whereClause += ` AND customerId="${customerId}"`;
    }

    if (email) {
      whereClause += ` AND customerEmail="${email}"`;
    }

    const response = await this.coreClientService
      .getClient()
      .carts()
      .get({
        queryArgs: {
          where: whereClause,
          limit: pageSize,
          offset,
        },
        headers: this.requestContextService.getHeaders(),
      })
      .execute();

    return {
      carts: response.body.results,
      total: response.body.total ?? 0,
    };
  }
}
