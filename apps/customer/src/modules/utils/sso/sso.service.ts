import { Injectable } from '@nestjs/common';
import * as passport from 'passport';

@Injectable()
export class SSOService {
  constructor() {
    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((user, done) => {
      done(null, user);
    });
  }
}
