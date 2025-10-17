import { Injectable } from '@nestjs/common';
import { CommerceCustomerRepository } from '../customer.repo';
import { CoreClientService } from '../../../../config';
import { Customer, CustomerUpdateAction } from '@commercetools/platform-sdk';
import { CoreRegisterCustomerDTO, UpdateCustomerDto } from '../../dto';
import { CustomerModel } from '../../models';
import { RequestContextService } from '../../../../config/request-context.service';

@Injectable()
export class CommercetoolRepository implements CommerceCustomerRepository {
    constructor(
        private readonly coreClientService: CoreClientService,
        private readonly requestContextService: RequestContextService
    ){}

    /**
     * 
     * @param customer 
     * @param actions 
     */
    async updateAllCustomerActions(customer: Customer, actions: Array<CustomerUpdateAction>): Promise<CustomerModel | null> {
        try {
            let customerUpdate = new UpdateCustomerDto();
            customerUpdate.version = customer.version;
            customerUpdate.actions = actions;

            const headers = this.requestContextService.getHeaders();

            const customerDataCollection =  await this.coreClientService
                        .getClient()
                        .customers()
                        .withId({ID: customer.id})
                        .post({
                            body: customerUpdate,
                            headers: headers
                        })
                        .execute();

            return customerDataCollection.body && Object.keys(customerDataCollection.body).length > 0 ? customerDataCollection.body : null;
        } catch (error) {
            const concurrentError = error?.body?.errors?.find((err: { code: string; }) => err.code === 'ConcurrentModification');
            if (concurrentError && concurrentError.currentVersion) {
                customer = {...customer, version: concurrentError.currentVersion}
                return await this.updateAllCustomerActions(customer, actions);
            }
        }
        return null;
    }

    /**
     * 
     * @param customerEmail 
     */
    async fetchCustomerByEmail(customerEmail: string): Promise<Customer | null> {
        const customerDataCollection = await this.coreClientService.getClient().customers().get({
            queryArgs: {
                expand: "customerGroup",
                where: `email = "${customerEmail}"`
            }
        }).execute();
        return customerDataCollection.body.count > 0 ? customerDataCollection.body.results[0] : null;
    }

    async fetchCustomerById(customerId: string): Promise<Customer | null> {
        const customerDataCollection = await this.coreClientService.getClient().customers().withId({ID: customerId}).get({
            queryArgs: {
                expand: "customerGroup"
            }
        }).execute();
        return customerDataCollection.body ?? null;
    }

    /**
     * 
     * @param email 
     * @param ttlMinutes 
     */
    async generatePasswordResetToken(email: string, ttlMinutes: number = 60) {
        const token = await this.coreClientService
                                    .getClient()
                                    .customers()
                                    .passwordToken()
                                    .post({
                                        body: {
                                            email: email,
                                            ttlMinutes: ttlMinutes
                                        }
                                    })
                                    .execute();
        return token.body.value;
    }

    /**
     * 
     * @param email 
     * @param password 
     */
    async setPassword(email: string, password: string) {
        const passwordResetToken = await this.generatePasswordResetToken(email);

        const customerDataCollection = await this.coreClientService
                                            .getClient()
                                            .customers()
                                            .passwordReset()
                                            .post({
                                                body: {
                                                    tokenValue: passwordResetToken,
                                                    newPassword: password
                                                }
                                            })
                                            .execute();
        return customerDataCollection.body && Object.keys(customerDataCollection.body).length > 0 ? customerDataCollection.body : null;
    }

    /**
     * 
     * @param customerDraft 
     */
    async createCustomerFromDraft(customerDraft: CoreRegisterCustomerDTO) {
        const headers = this.requestContextService.getHeaders();
        let customerDataCollection = await this.coreClientService
                                    .getClient()
                                    .customers()
                                    .post({
                                        body: customerDraft,
                                        headers: headers
                                    })
                                    .execute();

    return customerDataCollection.body && Object.keys(customerDataCollection.body).length > 0 ? customerDataCollection.body.customer : null;
    }
}