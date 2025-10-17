import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as jsonWebToken from 'jsonwebtoken';
import * as jwksRsa from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import type { ITenantConfigService } from '../workspace-configuration';
import { TENANT_CONFIG_SERVICE } from '../workspace-configuration';
import { JwtException } from './JwtException.exception';
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class CustomJwtService {
  private jwksClient: jwksRsa.JwksClient | null = null;

  constructor(
    private readonly configService: ConfigService,
    @Inject(TENANT_CONFIG_SERVICE)
    private readonly tenantConfigService: ITenantConfigService,
  ) {}

  private async getJwksClient(): Promise<jwksRsa.JwksClient> {
    if (!this.jwksClient) {
      const authConfig = await this.tenantConfigService.getCimpressAuth();
      this.jwksClient = new jwksRsa.JwksClient({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri: authConfig.jwks.uri,
      });
    }
    return this.jwksClient;
  }

  private async getSigningKey(kid: string): Promise<string> {
    const client = await this.getJwksClient();
    const key = await client.getSigningKey(kid);
    return key.getPublicKey();
  }

  async verifyToken(token: string|undefined): Promise<{ header: any; payload: any }> {
    if (!token) {
      throw new JwtException('Unauthorised', HttpStatus.UNAUTHORIZED, [
        'Missing Bearer token',
      ]);
    }

    const decoded = jsonWebToken.decode(token, { complete: true }) as any;
    if (!decoded?.payload?.iss) {
      throw new JwtException('Unauthorised', HttpStatus.UNAUTHORIZED, [
        'Invalid token',
      ]);
    }

    const { payload, header } = decoded;
    const issuer = payload.iss;
    const audienceArray = this.configService
      .get('AUTH0_AUDIENCE')
      .split(',')
      .map((s) => s.trim());

    const authConfig = await this.tenantConfigService.getCimpressAuth();
    if (!authConfig.allowedAuthIssuers.includes(issuer)) {
      throw new JwtException('Unauthorised', HttpStatus.UNAUTHORIZED, [
        'Unsupported issuer',
      ]);
    }

    try {
      const signingKey = await this.getSigningKey(header.kid);

      const verifiedPayload = jsonWebToken.verify(token, signingKey, {
        algorithms: ['RS256'],
        issuer,
        audience: audienceArray,
      }) as any;

      return { header, payload: verifiedPayload };
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new JwtException('Unauthorised', HttpStatus.UNAUTHORIZED, [
          'Provided JWT is trying to be used after exp claim',
        ]);
      } else if (err instanceof NotBeforeError) {
        throw new JwtException('Unauthorised', HttpStatus.UNAUTHORIZED, [
          'Provided JWT is trying to be used before nbf or iat claim',
        ]);
      } else if (err instanceof JsonWebTokenError) {
        throw new JwtException('Unauthorised', HttpStatus.UNAUTHORIZED, ['Provided JWT signature verification failed']);
      } else {
        throw new JwtException('Unexpected value error', HttpStatus.INTERNAL_SERVER_ERROR, ['JWT verification failed']);
      }
    }
  }
}
