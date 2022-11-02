import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  controllers: [AppController, AuthController, UserController],
  providers: [AppService, UserService, AuthService, PrismaService, JwtService],
})
export class AppModule {}
