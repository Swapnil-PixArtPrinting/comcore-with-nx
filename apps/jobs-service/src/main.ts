import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { createBullBoard } from '@bull-board/api';
import { Queue } from 'bullmq';
import { RedisConfig } from './redis.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('JobsService');

  // Setup Bull Board for queue monitoring
  setupBullBoard(configService, app);

  const port = process.env.JOBS_SERVICE_PORT || 9003;
  await app.listen(port);

  logger.log(`Jobs Service is running on port ${port}`);
  logger.log(`Queue Dashboard is available at http://localhost:${port}/`);
}

function setupBullBoard(configService: ConfigService, app) {
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/');

  const customerQueue = new Queue('customer-queue', {
    connection: RedisConfig.getOptions(configService),
  });

  createBullBoard({
    queues: [new BullMQAdapter(customerQueue)],
    serverAdapter,
  });

  app.use('/', serverAdapter.getRouter());
}

void bootstrap();
