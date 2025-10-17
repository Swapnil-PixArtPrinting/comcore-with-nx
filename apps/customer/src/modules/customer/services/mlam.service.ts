import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CustomerModel } from '@comcore/ocs-lib-corecommerce';
import { CUSTOMER_SERVICE, CustomerService } from './customer.service';
import { CUSTOMER_FACADE, CustomerFacade } from './customer.facade';
import { CustomerProviderRepository } from '../repositories/customer-provider.repository';
import {
  CUSTOMER_CUSTOM_FIELDS,
  PROFILE_USER_TYPE,
} from '../enums/common.enum';
import {
  CUSTOMER_ERROR_CASE,
  CUSTOMER_ERROR_CODE,
} from '../enums/errorCode.enum';
import { RenderableException } from '../../../exceptions/RenderableException.exception';
import { CustomerKeyGenerator } from './customer-key-generator.service';

@Injectable()
export class MlamService {
  constructor(
    @Inject(forwardRef(() => CUSTOMER_SERVICE))
    private readonly profileService: CustomerService,
    private readonly customerProviderRepository: CustomerProviderRepository,
    @Inject(CUSTOMER_FACADE)
    private readonly customerFacade: CustomerFacade,
  ) {}

  /**
   * Check if the customer is a company
   * @param customer
   */
  isCompany(customer: CustomerModel) {
    // Check if the customer is company
    if (
      customer?.custom?.fields &&
      Object.prototype.hasOwnProperty.call(
        customer.custom.fields,
        CUSTOMER_CUSTOM_FIELDS.CF_IS_COMPANY,
      )
    )
      return customer?.custom?.fields?.[CUSTOMER_CUSTOM_FIELDS.CF_IS_COMPANY];
  }

  /**
   * Get the parent id of the customer
   * @param customer
   */
  getParentId(customer: CustomerModel) {
    if (
      customer?.custom?.fields &&
      Object.prototype.hasOwnProperty.call(
        customer.custom.fields,
        CUSTOMER_CUSTOM_FIELDS.CF_COMPANY_ID,
      )
    )
      return customer?.custom?.fields?.[CUSTOMER_CUSTOM_FIELDS.CF_COMPANY_ID];
  }

  /**
   * Get all the child ids of teh children attached to the customer
   * @param customer
   */
  getChildIds(customer: CustomerModel) {
    const childIds = [];
    if (
      customer?.custom &&
      Object.prototype.hasOwnProperty.call(
        customer?.custom?.fields,
        CUSTOMER_CUSTOM_FIELDS.CF_CUSTOMERS_REFERENCE,
      )
    ) {
      const childrens =
        customer?.custom?.fields?.[
          CUSTOMER_CUSTOM_FIELDS.CF_CUSTOMERS_REFERENCE
        ];
      childrens.forEach((children) => {
        childIds.push(children.id);
      });
    }

    return childIds;
  }

  async updateCustomerReferences(
    parentCustomer: CustomerModel,
    childCustomer: CustomerModel,
  ): Promise<CustomerModel> {
    const fields = parentCustomer?.custom?.fields;
    const referenceFieldKey = CUSTOMER_CUSTOM_FIELDS.CF_CUSTOMERS_REFERENCE;

    let children = new Set();

    if (fields && referenceFieldKey in fields) {
      const existing = fields[referenceFieldKey];
      children = new Set(existing); // Convert array to Set to avoid duplicates
    }

    children.add(
      await this.customerProviderRepository.repository.getCustomerReference(
        childCustomer.id,
      ),
    ); // Assuming you want to store just the ID, similar to CustomerReference::ofId()

    // Convert Set back to array before storing, if needed by your backend
    return await this.customerProviderRepository.repository.setCustomField(
      parentCustomer,
      referenceFieldKey,
      Array.from(children),
      true,
    );
  }

  async setParent(
    childCustomer: CustomerModel,
    parentCustomer: CustomerModel,
  ): Promise<CustomerModel> {
    const parentId = parentCustomer?.id ?? null;
    const actions = [];

    if (this.getImmediateParentId(childCustomer) !== parentId) {
      actions.push(
        await this.customerProviderRepository.repository.setCustomField(
          childCustomer,
          CUSTOMER_CUSTOM_FIELDS.CF_CUSTOMER_REFERENCE,
          parentId,
          false,
        ),
      );

      if (parentCustomer?.custom?.fields) {
        const fields = parentCustomer.custom.fields;

        if (this.isCompany(parentCustomer)) {
          const parentCustomerReference =
            await this.customerProviderRepository.repository.getCustomerReference(
              parentCustomer.id,
            );
          actions.push(
            await this.customerProviderRepository.repository.setCustomField(
              childCustomer,
              CUSTOMER_CUSTOM_FIELDS.CF_COMPANY_ID,
              parentCustomerReference,
              false,
            ),
          );
        } else if (CUSTOMER_CUSTOM_FIELDS.CF_COMPANY_ID in fields) {
          actions.push(
            await this.customerProviderRepository.repository.setCustomField(
              childCustomer,
              CUSTOMER_CUSTOM_FIELDS.CF_COMPANY_ID,
              fields[CUSTOMER_CUSTOM_FIELDS.CF_COMPANY_ID],
              false,
            ),
          );
        }
      }
    }

    return this.customerProviderRepository.repository.updateCustomerWithAllActions(
      childCustomer,
      actions,
      true,
    );
  }

  /**
   * Add a child to the parent customer
   * @param parentCustomer
   * @param childCustomer
   * @param companyRole
   */
  async addChild(
    parentCustomer: CustomerModel,
    childCustomer: CustomerModel,
    companyRole: string,
  ): Promise<CustomerModel> {
    if (
      !this.profileService.isActiveCustomer(parentCustomer) ||
      !this.profileService.isActiveCustomer(childCustomer)
    ) {
      throw new RenderableException(
        `Unable to add child. Parent or child customer is not active.`,
        null,
        CUSTOMER_ERROR_CODE.CHILD_ADDITION_FAILED,
        null,
        400,
        parentCustomer,
        CUSTOMER_ERROR_CASE.MASTER_INACTIVE_CUSTOMER,
      );
    }

    if (this.isCompany(childCustomer)) {
      throw new RenderableException(
        `A root customer cannot be added as a child to another customer.`,
        null,
        CUSTOMER_ERROR_CODE.CHILD_ADDITION_FAILED,
        null,
        400,
        parentCustomer,
        CUSTOMER_ERROR_CASE.MASTER_CANT_ADD_PARENT_AS_CHILD,
      );
    }

    const oldImmediateParentId = this.getImmediateParentId(childCustomer);
    if (oldImmediateParentId == parentCustomer.id) {
      return childCustomer;
    }

    if (oldImmediateParentId) {
      throw new RenderableException(
        `'Customer is already a child of another customer.`,
        null,
        CUSTOMER_ERROR_CODE.CHILD_ADDITION_FAILED,
        null,
        400,
        parentCustomer,
        CUSTOMER_ERROR_CASE.MASTER_CHILD_BELONGS_TO_OTHER_PARENT,
      );
    }

    let generateKey = null;
    const key = parentCustomer.key ?? null;
    if (key) generateKey = true;

    const actions = [];
    if (companyRole) {
      actions.push(
        await this.profileService.setCustomField(
          childCustomer,
          CUSTOMER_CUSTOM_FIELDS.CF_COMPANY_ROLE,
          companyRole,
          false,
        ),
      );
    }
    actions.push(
      await this.profileService.setCustomField(
        childCustomer,
        CUSTOMER_CUSTOM_FIELDS.CF_USER_TYPE,
        PROFILE_USER_TYPE.CHILD,
        false,
      ),
    );

    if (generateKey) {
      const parentKey = parentCustomer.key ?? null;
      let lastAssignedKey = null;

      const fields = parentCustomer?.custom?.fields;
      if (fields && 'customersReference' in fields) {
        const childrenRefs = fields['customersReference'] as Array<{
          id: string;
          typeId: string;
        }>;

        if (childrenRefs.length > 0) {
          const lastChildRef = childrenRefs[childrenRefs.length - 1];
          const lastChild = await this.customerFacade.fetchCustomerById(
            lastChildRef.id,
          ); // Assuming this returns a CustomerModel
          lastAssignedKey = lastChild?.key;
        }
      }
      const generator = new CustomerKeyGenerator();
      actions.push(
        await this.profileService.setKey(
          childCustomer,
          generator.generateNextId(parentKey, lastAssignedKey),
          false,
        ),
      );
    }

    childCustomer =
      await this.customerProviderRepository.repository.updateCustomerWithAllActions(
        childCustomer,
        actions,
        true,
      );

    parentCustomer = await this.updateCustomerReferences(
      parentCustomer,
      childCustomer,
    );

    childCustomer = await this.setParent(childCustomer, parentCustomer);

    if (oldImmediateParentId) {
      throw new RenderableException(
        `Cannot remove child at the moment`,
        ['Child removal from multi level accounts is not supported'],
        CUSTOMER_ERROR_CODE.CHILD_ADDITION_FAILED,
        null,
        400,
        null,
        CUSTOMER_ERROR_CASE.MULTI_LEVEL_ACCOUNT_CHILD_REMOVAL_NOT_SUPPORTED,
      );
    }

    return childCustomer;
  }

  /**
   * Get the immediate parent id of the customer
   * @param customer
   */
  getImmediateParentId(customer: CustomerModel): string | null {
    return (
      customer?.custom?.fields?.[
        CUSTOMER_CUSTOM_FIELDS.CF_CUSTOMER_REFERENCE
      ] ?? null
    );
  }
}
