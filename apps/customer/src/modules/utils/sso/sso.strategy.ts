import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy as PassportAuth0Strategy } from 'passport-auth0';
import * as passport from 'passport';

@Injectable()
export class Auth0Strategy {
  constructor(private configService: ConfigService) {}

  initialize() {
    const domain = this.configService.get<string>('AUTH_DOMAIN');
    const clientID = this.configService.get<string>('AUTH_CLIENT_ID');
    const clientSecret = this.configService.get<string>('AUTH_CLIENT_SECRET');
    const callbackURL = `${this.configService.get<string>('APP_URL')}/v2/callback`;

    passport.use(
      'auth0Node',
      new PassportAuth0Strategy(
        {
          domain: domain,
          clientID: clientID,
          clientSecret: clientSecret,
          callbackURL: callbackURL,
          scopeSeparator: ' ',
        },
        async (accessToken, refreshToken, extraParams, profile, done) => {
          return done(null, profile);
        },
      ),
    );
  }
}
