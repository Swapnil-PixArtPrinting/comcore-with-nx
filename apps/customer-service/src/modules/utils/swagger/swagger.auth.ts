import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class SwaggerAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    // If user session exists, allow access
    if (req.session['user']) return true;

    // Store the return path & redirect to login
    req.session['returnTo'] = req.originalUrl;
    res.redirect('/v2/login');
    return false;
  }
}
