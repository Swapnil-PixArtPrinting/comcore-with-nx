import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
    getCommon() {
        console.log("hello fro mcomon");
        return "Heyyyyy";
    }
}
