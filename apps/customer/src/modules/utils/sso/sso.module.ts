import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Auth0Strategy } from './sso.strategy';
import { SSOService } from './sso.service';

@Module({
  imports: [PassportModule.register({ session: true })],
  providers: [Auth0Strategy, SSOService],
  controllers: [],
})
export class SsoModule {}
