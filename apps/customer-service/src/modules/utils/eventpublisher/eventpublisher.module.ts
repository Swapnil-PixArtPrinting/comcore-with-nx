import { Module } from '@nestjs/common';
import { SnsModule } from '@app/awskit';
import {
  EVENT_PUBLISHER_SERVICE,
  EventPublisherService,
} from './services/event.service';
import { WorkspaceModule } from '@app/common';

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
