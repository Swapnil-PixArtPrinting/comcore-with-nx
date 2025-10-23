import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtException, CustomJwtService } from '@app/common';

@Injectable()
export class VerifyJwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: CustomJwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    let bearer: string | undefined;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      bearer = req.headers.authorization.split(' ')[1];
    }

    try {
      const { header, payload } = await this.jwtService.verifyToken(bearer);

      if (payload['https://claims.cimpress.io/is_anonymous']) {
        throw new JwtException('Unauthorised', HttpStatus.UNAUTHORIZED, [
          'Anonymous user calls not allowed',
        ]);
      }

      req.headers['emailOfRequestBy'] =
        payload['https://claims.cimpress.io/email'] ??
        payload['https://claims.cimpress.io/canonical_id'] ??
        null;
      req.headers['subjectOfRequestBy'] = payload['sub'] ?? null;
      req.headers['expires_in'] = ((payload.exp - payload.iat) / 60).toFixed(4);

      next();
    } catch (err) {
      if (err instanceof JwtException) {
        return res.status(err.getStatus()).json(err.getResponse());
      }
      throw err;
    }
  }
}
