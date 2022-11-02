import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('status')
  async getStatus(@Res() res: Response) {
    const status = await this.appService.getServerStatus();
    return res.status(status.code).json({ message: status.message });
  }
}
