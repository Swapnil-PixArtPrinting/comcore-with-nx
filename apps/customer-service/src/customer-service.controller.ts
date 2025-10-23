import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomerServiceService } from './customer-service.service';

@Controller()
export class CustomerServiceController {
  constructor(private readonly appService: CustomerServiceService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('v2/login')
  @UseGuards(AuthGuard('auth0Node'))
  login(): void {
    return;
  }

  @Get('v2/callback')
  @UseGuards(AuthGuard('auth0Node'))
  callback(@Req() req, @Res() res) {
    req.session.user = req.user;
    const returnTo = req.session.returnTo || '/api/documentation';
    delete req.session.returnTo;
    res.redirect(returnTo);
  }

  @Get('logout')
  logout(@Req() req, @Res() res) {
    req.session.destroy();
    res.redirect('/');
  }
}
