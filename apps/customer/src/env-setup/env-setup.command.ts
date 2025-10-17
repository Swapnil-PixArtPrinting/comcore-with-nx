import { Command, Positional } from 'nestjs-command';
import { Inject, Injectable } from '@nestjs/common';
import type { IEnvSetupService } from './services/env-setup.service.interface';
import { ENV_SETUP_SERVICE } from './services/env-setup.service.interface';
import * as fs from 'node:fs';
import * as path from 'node:path';

@Injectable()
export class EnvSetupCommand {
  constructor(
    @Inject(ENV_SETUP_SERVICE)
    private readonly envSetupService: IEnvSetupService,
  ) {}

  /**
   * Execute the command to generate the .env file.
   * @param force
   */
  @Command({
    command: 'env:setup [force]',
    describe: 'Generate .env file from AWS. Use --force to recreate the file.',
  })
  // Function which will execute on running the command
  async execute(
    @Positional({
      name: 'force',
      describe: 'Force re-creation of the .env file',
      type: 'boolean',
      default: false,
    })
    force: boolean,
  ) {
    // Get the /nestjs path
    const basePath = path.resolve(__dirname, '../../');

    // Get the path of the .env file
    const filePathEnv: string = path.join(basePath, '.env');

    // If force is passed as true, log a message that it will be recreated
    if (force) {
      console.log('FORCE: .env file will be re-created');
    }

    // Check if .env file exists
    const fileEnvExists: boolean = fs.existsSync(filePathEnv);
    if (fileEnvExists && !force) {
      console.log('.env file already exists');
      return;
    }

    // Generate the .env file
    await this.envSetupService.generateEnvFile();
  }
}
