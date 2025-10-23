import { Test, TestingModule } from '@nestjs/testing';
import { CustomJwtService } from './custom-jwt.service';
import { ConfigService } from '@nestjs/config';
import {
  ITenantConfigService,
  TENANT_CONFIG_SERVICE,
} from '../workspace-configuration';
import * as jsonWebToken from 'jsonwebtoken';
import * as jwksRsa from 'jwks-rsa';

jest.mock('jsonwebtoken');
jest.mock('jwks-rsa');

/*

  In this file, we have the following test cases grouped accordingly

  1. The token itself is missing -> Throws Missing Bearer Token JWTExceptino 

  After the token is decoded 

  2. If the issuer is missing -> Throw Invalid token JWTException
  3. If the issue is present, but not a valid issuer that we have configured -> Unsupported issue JWTException 

  Verifying the token 

  4. Verification is succesful ->  A object with header and payload is returned.
  5. If the token is expired -> TokenExpiredError + JWTException
  6. The token is before the 'not before' or 'issued at' time -> NotBeforeError
  7. Verification Error in token -> JsonWebTokenError 
  
 */

describe('CustomJwtService', () => {
  let service: CustomJwtService;
  let configService: ConfigService;
  let tenantConfigService: ITenantConfigService;

  const mockAuthConfig = {
    jwks: { uri: 'https://test.com/.well-known/jwks.json' },
    allowedAuthIssuers: ['https://issuer.test'],
  };

  const fakeKey = 'FAKE_PUBLIC_KEY';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomJwtService,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('aud1,aud2') },
        },
        {
          provide: TENANT_CONFIG_SERVICE,
          useValue: {
            getCimpressAuth: jest.fn().mockResolvedValue(mockAuthConfig),
          },
        },
      ],
    }).compile();

    service = module.get(CustomJwtService);
    configService = module.get(ConfigService);
    tenantConfigService = module.get(TENANT_CONFIG_SERVICE);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Missing Token', () => {
    it('should throw Missing Bearer Token JwtException', async () => {
      await expect(service.verifyToken(null as any)).rejects.toMatchObject({
        response: {
          success: 0,
          error: {
            msg: 'Unauthorised',
            detail: ['Missing Bearer token'],
            code: 401,
          },
        },
        status: 401,
      });
    });
  });

  describe('Token Decoding', () => {
    it('should throw Invalid token if issuer is missing', async () => {
      (jsonWebToken.decode as jest.Mock).mockReturnValue({});
      await expect(service.verifyToken('fake')).rejects.toMatchObject({
        response: {
          success: 0,
          error: {
            msg: 'Unauthorised',
            detail: ['Invalid token'],
            code: 401,
          },
        },
        status: 401,
      });
    });

    it('should throw Unsupported issuer if issuer is not allowed', async () => {
      (jsonWebToken.decode as jest.Mock).mockReturnValue({
        payload: { iss: 'https://bad-issuer' },
        header: { kid: 'kid1' },
      });

      await expect(service.verifyToken('fake')).rejects.toMatchObject({
        response: {
          success: 0,
          error: {
            msg: 'Unauthorised',
            detail: ['Unsupported issuer'],
            code: 401,
          },
        },
        status: 401,
      });
    });
  });

  describe('Token Verification', () => {
    beforeEach(() => {
      (jsonWebToken.decode as jest.Mock).mockReturnValue({
        payload: { iss: 'https://issuer.test' },
        header: { kid: 'kid1' },
      });

      (jwksRsa.JwksClient.prototype.getSigningKey as any) = jest
        .fn()
        .mockResolvedValue({
          getPublicKey: () => fakeKey,
        });
    });

    it('should return header and payload if verification is successful', async () => {
      (jsonWebToken.verify as jest.Mock).mockReturnValue({ sub: 'user1' });

      const result = await service.verifyToken('valid.token');
      expect(result).toEqual({
        header: { kid: 'kid1' },
        payload: { sub: 'user1' },
      });
    });

    it('should throw JwtException if token is expired', async () => {
      (jsonWebToken.verify as jest.Mock).mockImplementation(() => {
        throw new (require('jsonwebtoken').TokenExpiredError)(
          'expired',
          new Date(),
        );
      });

      await expect(service.verifyToken('expired.token')).rejects.toMatchObject({
        response: {
          success: 0,
          error: {
            msg: 'Unauthorised',
            detail: ['Provided JWT is trying to be used after exp claim'],
            code: 401,
          },
        },
        status: 401,
      });
    });

    it('should throw JwtException if token is used before nbf or iat', async () => {
      (jsonWebToken.verify as jest.Mock).mockImplementation(() => {
        throw new (require('jsonwebtoken').NotBeforeError)('nbf', new Date());
      });

      await expect(service.verifyToken('nbf.token')).rejects.toMatchObject({
        response: {
          success: 0,
          error: {
            msg: 'Unauthorised',
            detail: [
              'Provided JWT is trying to be used before nbf or iat claim',
            ],
            code: 401,
          },
        },
        status: 401,
      });
    });

    it('should throw JwtException if signature verification fails', async () => {
      (jsonWebToken.verify as jest.Mock).mockImplementation(() => {
        throw new (require('jsonwebtoken').JsonWebTokenError)('invalid');
      });

      await expect(service.verifyToken('bad.signature')).rejects.toMatchObject({
        response: {
          success: 0,
          error: {
            msg: 'Unauthorised',
            detail: ['Provided JWT signature verification failed'],
            code: 401,
          },
        },
        status: 401,
      });
    });
  });
});
