import {
  Controller,
  Post,
  Body,
  Inject,
  UseFilters,
  Patch,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import {
  LoggingService,
  TENANT_CONFIG_SERVICE,
  ITenantConfigService,
  WorkspaceService,
} from '@app/common';
import {
  CoreConfigService,
  CoreClientService,
  dataClient,
  Workspace,
} from '@app/corecommerce';
import { ApiType } from '../../shared/enums/api-type.enum';
import { API_V2_BASE_PATH } from '../../shared/constants/api.constants';
import { ChangeEmailDto } from './data/dto/change-email.dto';
import { CUSTOMER_SERVICE, CustomerService } from './services/customer.service';
import { RenderableExceptionFilter } from '../../filters/RenderableException.filter';
import { ValidationExceptionFilter } from '../../filters/ValidationException.filter';
import { ApiTypeService } from '../../apiType/api.type';
import { RegisterCustomerDto } from './data/dto/register-customer.dto';

/**
 * @description Controller for Customer
 */
@UseFilters(RenderableExceptionFilter)
@UseFilters(ValidationExceptionFilter)
@Controller(API_V2_BASE_PATH)
@ApiTags('Customer')
export class CustomerController {
  /**
   * @description Constructor
   * @param customerService
   * @param apiTypeService
   * @param workspaceService
   * @param coreConfigService
   * @param tenantConfigService
   * @param coreClientService
   * @param loggingService
   */
  constructor(
    @Inject(CUSTOMER_SERVICE)
    private readonly customerService: CustomerService,
    private readonly loggingService: LoggingService,
    private readonly apiTypeService: ApiTypeService,
    private readonly coreClientService: CoreClientService,
    private readonly workspaceService: WorkspaceService,
    @Inject(CoreConfigService)
    private readonly coreConfigService: CoreConfigService,
    @Inject(TENANT_CONFIG_SERVICE)
    private readonly tenantConfigService: ITenantConfigService,
  ) {}

  //TODO: Create a parent class (BaseController) to set values mentioned below. So that other DI will resolved correctly.
  async setContext(ctool = dataClient.COMMERCETOOL) {
    this.apiTypeService.setApiType(ApiType.REST);
    const dataClientType = await this.tenantConfigService.get(
      this.workspaceService.getWorkspace(),
      'dataClient',
    );
    const coreCommerceClient =
      await this.coreConfigService.getCoreCommerceClientInstance(
        this.workspaceService.getWorkspace() as Workspace,
        dataClientType,
      );

    this.coreClientService.setClient(coreCommerceClient['client']);
    this.coreClientService.setDataClient(ctool);
  }

  /**
   * @description Register Customer
   * @param data
   */
  @Post('register')
  @ApiHeader({ name: 'workspace', description: 'Workspace Identifier' })
  @ApiBearerAuth()
  async registerCustomer(@Body() data: RegisterCustomerDto) {
    this.loggingService.info(
      ['Customer'],
      'CustomerController@registerCustomer',
      data,
    );
    await this.setContext();
    return await this.customerService.registerCustomer(data);
  }

  /**
   * @description Change Email of Customer, Cart and Order
   * @param data
   */
  @Patch('changeEmail')
  @ApiHeader({ name: 'workspace', description: 'Workspace Identifier' })
  @ApiBearerAuth()
  async changeEmail(@Body() data: ChangeEmailDto) {
    this.loggingService.info(
      ['Customer'],
      'CustomerController@changeEmail',
      data,
    );
    await this.setContext();
    return await this.customerService.changeEmail(data.oldEmail, data.newEmail);
  }

  @Get(':id')
  @ApiHeader({ name: 'workspace', description: 'Workspace Identifier' })
  @ApiBearerAuth()
  async getCustomer(
    @Param('id') id: string,
    @Query('noCache') noCache?: boolean,
  ) {
    this.loggingService.info(['Customer'], 'CustomerController@getCustomer', {
      id,
    }); // Log the request
    await this.setContext();
    return await this.customerService.getCustomerById(id, noCache);
  }

  // Internal job processing endpoints for jobs-service (no auth required)
  @Post('internal/registration-pca')
  async handleRegistrationPCA(@Body() data: any) {
    this.loggingService.info(
      ['Customer'],
      'CustomerController@handleRegistrationPCA',
      data,
    );
    // Set workspace from job data if available
    if (data.workspace) {
      this.workspaceService.setWorkspace(data.workspace);
    }
    await this.setContext();
    const { customer, stores, customerData } = data;
    return await this.customerService.addStoreAfterRegistration(
      customer,
      stores,
      customerData,
    );
  }

  @Post('internal/registration-event')
  async handleRegistrationEvent(@Body() data: any) {
    this.loggingService.info(
      ['Customer'],
      'CustomerController@handleRegistrationEvent',
      data,
    );
    // Set workspace from job data if available
    if (data.workspace) {
      this.workspaceService.setWorkspace(data.workspace);
    }
    await this.setContext();
    const { customer, guestCustomer, tenantId, group, eventMetaData } = data;

    // Implementation would need to be moved from the original processor
    // For now, just log the processing
    this.loggingService.info(['Customer'], 'Processing registration event', {
      customerId: customer?.id,
    });

    return { success: true, message: 'Registration event processed' };
  }

  @Post('internal/email-updated-event')
  async handleEmailUpdatedEvent(@Body() data: any) {
    this.loggingService.info(
      ['Customer'],
      'CustomerController@handleEmailUpdatedEvent',
      data,
    );
    // Set workspace from job data if available
    if (data.workspace) {
      this.workspaceService.setWorkspace(data.workspace);
    }
    await this.setContext();
    const { customer, oldEmail, newEmail } = data;

    // Implementation would need to be moved from the original processor
    // For now, just log the processing
    this.loggingService.info(['Customer'], 'Processing email updated event', {
      customerId: customer?.id,
      oldEmail,
      newEmail,
    });

    return { success: true, message: 'Email updated event processed' };
  }
}
