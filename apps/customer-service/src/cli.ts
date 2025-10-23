import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';
import { CommandAppModule } from './command-app-module/command-app-module.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(CommandAppModule, {
    logger: false,
  });

  try {
    // Execute the command requested via CLI
    await app.select(CommandModule).get(CommandService).exec();
    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('Command execution failed:', error);
    process.exit(1);
  }
}

bootstrap();
