import { CommonService } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomerServiceService {
  constructor(private readonly commonService: CommonService) {}
  getHello(): string {
    const asdf = this.commonService.getCommon();
    console.log(asdf);
    return 'Hello World!';
  }
}
