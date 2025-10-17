import { Module } from '@nestjs/common';
import { SnsModule } from '@comcore/ocs-aws-kit';
import {
  EVENT_PUBLISHER_SERVICE,
  EventPublisherService,
} from './services/event.service';
import { WorkspaceModule } from '@comcore/ocs-lib-common';

@Module({
  imports: [SnsModule, WorkspaceModule],
  providers: [
    {
      useClass: EventPublisherService,
      provide: EVENT_PUBLISHER_SERVICE,
    },
  ],
  exports: [EVENT_PUBLISHER_SERVICE],
})
export class EventPublisherModule {}
