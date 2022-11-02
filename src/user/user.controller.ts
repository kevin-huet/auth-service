import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';
import { Ctx, MessagePattern } from '@nestjs/microservices';
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  getUser(@Param('id') id: string) {
    //this.userService.getUser();
  }

  @Put('password')
  changePassword() {}

  @Put('avatar')
  changeAvatar() {}

  @Post('create')
  async createUser(
    @Body() userData: { username: string; email: string; password: string },
  ): Promise<UserModel> {
    return await this.userService.createUser(userData);
  }

  @MessagePattern('test')
  async test(body, @Ctx() context) {
    console.log(context.getSubject());
    return 'oh mince';
  }
}
