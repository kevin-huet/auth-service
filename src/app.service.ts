import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getServerStatus(): Promise<StatusDto> {
    return { code: 200, message: '' };
  }
}
