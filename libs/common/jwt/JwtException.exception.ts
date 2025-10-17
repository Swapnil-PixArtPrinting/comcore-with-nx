import { HttpException } from '@nestjs/common';

export class JwtException extends HttpException {
  constructor(message: string, code: number, errors: string[] = []) {
    super(
      {
        success: 0,
        error: {
          msg: message,
          detail: errors,
          code: code,
        },
      },
      code,
    );
  }
}
