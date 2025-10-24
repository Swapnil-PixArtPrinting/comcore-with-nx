import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({})
export class DatabaseModule {
  static forRootAsync(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            const required = [
              'DB_HOST',
              'DB_PORT',
              'DB_USERNAME',
              'DB_PASSWORD',
              'DB_DATABASE',
            ];
            const missing = required.filter((key) => !configService.get(key));
            if (missing.length) {
              console.warn(
                `⚠️ DB module skipped: Missing ENV vars: ${missing.join(', ')}`,
              );
              if (missing.length) {
                throw new Error(
                  `❌ Missing DB env vars: ${missing.join(', ')}`,
                );
              }
            }

            return {
              type: 'mysql',
              host: configService.get<string>('DB_HOST'),
              port: configService.get<number>('DB_PORT'),
              username: configService.get<string>('DB_USERNAME'),
              password: configService.get<string>('DB_PASSWORD'),
              database: configService.get<string>('DB_DATABASE'),
              autoLoadEntities: true,
              synchronize: false,
            };
          },
        }),
      ],
    };
  }
}
