import { Module } from '@nestjs/common';
import { SwaggerModule } from './swagger/swagger.module';
import { SsoModule } from './sso/sso.module';
import { EventPublisherModule } from './eventpublisher/eventpublisher.module';
import { CustomerNumberGeneratorModule } from './customer-number-generator/customer-number-generator.module';
import { OrderServiceToolsModule } from './order-service-tools/order-service-tools.module';

@Module({
  imports: [
    SwaggerModule,
    SsoModule,
    EventPublisherModule,
    CustomerNumberGeneratorModule,
    OrderServiceToolsModule,
  ],
})
export class UtilsModule {}
