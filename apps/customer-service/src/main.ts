import { NestFactory } from '@nestjs/core';
import { CustomerServiceModule } from './customer-service.module';
import session from 'express-session';
import passport from 'passport';
import { ConfigService } from '@nestjs/config';
import { RedisConfig } from './redis.config';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { Queue } from 'bullmq';
import * as fs from 'node:fs';
import * as dotenv from 'dotenv';

// Filters, Interceptors, Services
import { GlobalExceptionFilter } from './filters/GlobalException.filter';
import { ValidationExceptionFilter } from './filters/ValidationException.filter';
import { ResponseInterceptor } from './interceptors/response-interceptor/response-interceptor.interceptor';
import { SwaggerService } from './modules/utils/swagger/swagger.service';
import { SwaggerAuthGuard } from './modules/utils/swagger/swagger.auth';
import { Auth0Strategy } from './modules/utils/sso/sso.strategy';
import { LoggingService } from '@app/common';
import {
  CORECOMMERCE_INITIALIZER_SERVICE,
  ICoreCommerceInitializerService,
} from './modules/core-commerce-initializer/services/core-commerce-initialazer-service.interface';
import {
  BadRequestException,
  ExecutionContext,
  ValidationPipe,
} from '@nestjs/common';

async function loadEnv() {
  const envPath = '.env';
  if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const key in envConfig) {
      process.env[key] = envConfig[key];
    }
  }
}

async function waitForEnvVariables(
  keys: string[],
  timeout = 30000,
  interval = 1000,
) {
  const start = Date.now();
  return new Promise<void>((resolve, reject) => {
    const timer = setInterval(async () => {
      await loadEnv();
      const missing = keys.filter((key) => !process.env[key]);
      if (missing.length === 0) {
        clearInterval(timer);
        resolve();
      }
      if (Date.now() - start > timeout) {
        clearInterval(timer);
        reject(
          new Error(`Timeout: Missing ENV variables: ${missing.join(', ')}`),
        );
      }
    }, interval);
  });
}

async function setupSession(app, configService: ConfigService) {
  const redisClient = createClient({
    socket: {
      host: RedisConfig.getOptions(configService).host,
      port: RedisConfig.getOptions(configService).port,
    },
  });
  await redisClient.connect();

  app.use(
    session({
      store: new RedisStore({ client: redisClient, prefix: 'sess:' }),
      secret: process.env.SESSION_SECRET || 'pix-comcore',
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
}

async function setupBullBoard(configService: ConfigService, app) {
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');

  const customerQueue = new Queue('customer-queue', {
    connection: RedisConfig.getOptions(configService),
  });

  createBullBoard({
    queues: [new BullMQAdapter(customerQueue)],
    serverAdapter,
  });

  app.use('/admin/queues', serverAdapter.getRouter());
}

async function setupSwagger(app, loggingService: LoggingService) {
  const swaggerService = app.get(SwaggerService);

  app.use('/api/documentation', (req, res, next) => {
    new SwaggerAuthGuard().canActivate({
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
    } as ExecutionContext)
      ? next()
      : null;
  });

  await swaggerService.setupSwagger(app);
}

async function bootstrap() {
  await loadEnv();

  const app = await NestFactory.create(CustomerServiceModule);
  const configService = app.get(ConfigService);
  const loggingService = await app.resolve(LoggingService);

  // Global filters
  app.useGlobalFilters(
    new GlobalExceptionFilter(loggingService),
    new ValidationExceptionFilter(loggingService),
  );

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) =>
        new BadRequestException(
          errors.map((error) => ({
            property: error.property,
            constraints: error.constraints,
          })),
        ),
    }),
  );

  // Interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Uncaught exception handling
  process.on('uncaughtException', (error) =>
    console.error('🛑 Uncaught Exception:', error),
  );
  process.on('unhandledRejection', (reason, promise) =>
    console.error('⚠️ Unhandled Rejection at:', promise, 'reason:', reason),
  );

  const requiredEnvVars = [
    'CTOOLS_CLIENT_ID',
    'CTOOLS_CLIENT_SECRET',
    'AUTH_DOMAIN',
    'AUTH_CLIENT_ID',
    'AUTH_CLIENT_SECRET',
    'APP_URL',
    'REDIS_HOST',
    'REDIS_PORT',
  ];

  await waitForEnvVariables(requiredEnvVars, 100000);

  const coreCommerceInitializerService =
    app.get<ICoreCommerceInitializerService>(CORECOMMERCE_INITIALIZER_SERVICE);
  await coreCommerceInitializerService.initialize();

  const auth0Strategy = app.get(Auth0Strategy);
  auth0Strategy.initialize();

  await setupSession(app, configService);
  await setupBullBoard(configService, app);
  await setupSwagger(app, loggingService);

  await app.listen(process.env.PORT ?? 9002);
  console.log('Server started successfully!');
}

bootstrap();
