import { Module } from '@nestjs/common';
import { CoreCommerceConfigModule } from '@app/common';
import { CoreConfigModule } from '@app/corecommerce';
import { CORECOMMERCE_INITIALIZER_SERVICE } from './services/core-commerce-initialazer-service.interface';
import { CoreCommerceCommercetoolServiceImpl } from './services/implementations/core-commerce.commercetool.service.impl';

/**
 * @description Module for Core Commerce Initializer
 */
@Module({
  imports: [CoreConfigModule, CoreCommerceConfigModule],
  providers: [
    {
      useClass: CoreCommerceCommercetoolServiceImpl,
      provide: CORECOMMERCE_INITIALIZER_SERVICE,
    },
  ],
  exports: [CORECOMMERCE_INITIALIZER_SERVICE],
})
export class CoreCommerceInitializerModule {}
