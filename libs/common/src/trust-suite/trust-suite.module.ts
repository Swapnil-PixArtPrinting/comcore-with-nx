import { Module, DynamicModule, Provider } from '@nestjs/common';

export interface TrustSuiteModuleAsyncOptions {
  useFactory: (...args: any[]) => any;
  inject?: any[];
}

@Module({})
export class TrustSuiteModule {
  static forRootAsync(options: TrustSuiteModuleAsyncOptions): DynamicModule {
    const optionsProvider: Provider = {
      provide: 'TRUST_SUITE_CONFIG',
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    return {
      module: TrustSuiteModule,
      imports: [],
      providers: [optionsProvider],
      exports: [],
    };
  }
}
