import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { User as UserModel } from 'prisma';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import {
  AccountVerificationRequestDTO,
  LogDTO,
  LoginRequestDTO,
  RegisterRequestDTO,
  ResponseDTO,
  ValidateRequestDTO,
} from './auth.dto';
import { ClientProxy } from '@nestjs/microservices';
import { MailerService } from './mailer.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('LOGGER_SERVICE') private loggerClient: ClientProxy,
    private mailerService: MailerService,
    private usersService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  public async register({
    password,
    ...rest
  }: RegisterRequestDTO): Promise<ResponseDTO> {
    const encryptedPassword = await this.encodePassword(password);
    try {
      const code = Math.floor(100000 + Math.random() * 999999).toString();
      const user = await this.prisma.user.create({
        data: {
          email: rest.email,
          username: rest.username,
          verificationCode: code,
          password: encryptedPassword,
          terms: true,
        },
      });
      await this.mailerService.sendVerificationMail(user);
      await this.sendLog({
        name: 'User registered',
        description: `$The user : '${user.username}' with id '${user.id}' `,
        type: 'INFO',
      });
      return { status: HttpStatus.OK, error: null };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          await this.sendLog({
            name: 'Registration',
            description: `Prisma error code: ${e.code}`,
            type: 'ERROR',
          });
          return {
            status: HttpStatus.CONFLICT,
            error: ['Username or Email already exist'],
          };
        }
      } else {
        await this.sendLog({
          name: 'Registration',
          description: `Prisma error code: ${e.code}`,
          type: 'ERROR',
        });
        return {
          status: HttpStatus.CONFLICT,
          error: ['Unknown error'],
        };
      }
    }
  }

  public async login({
    email,
    password,
  }: LoginRequestDTO): Promise<ResponseDTO> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      return {
        status: HttpStatus.CONFLICT,
        error: ['Invalid email or password'],
        userId: null,
      };
    }

    const isPasswordValid: boolean = await this.isPasswordValid(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return {
        status: HttpStatus.CONFLICT,
        error: ['Invalid email or password'],
      };
    }

    if (!user.verified) {
      return {
        status: HttpStatus.FORBIDDEN,
        error: ['This account is not verified'],
        user: { email: user.email, username: user.username, verified: false },
      };
    }

    const token: string = await this.generateToken(user);

    return { status: HttpStatus.OK, error: null, token };
  }

  private async generateToken(user: UserModel) {
    return this.jwtService.sign({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  }

  public async validate({ token }: ValidateRequestDTO): Promise<ResponseDTO> {
    try {
      const decodedToken: UserModel = await this.jwtService.verify(token);
      if (!decodedToken || !decodedToken.id) {
        return {
          status: HttpStatus.FORBIDDEN,
          error: ['Token is invalid'],
          userId: null,
        };
      }
      const auth: any = await this.findUser({
        id: decodedToken.id,
        username: decodedToken.username,
      });
      if (!auth) {
        return {
          status: HttpStatus.CONFLICT,
          error: ['User not found'],
          userId: null,
        };
      }
      console.log('ok');
      return { status: HttpStatus.OK, error: null, user: decodedToken };
    } catch (e) {
      console.log(e);
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        await this.sendLog({
          name: 'Validate',
          description: `Prisma error code: ${e.code}`,
          type: 'ERROR',
        });
      }
      return { status: HttpStatus.BAD_REQUEST, error: [e.code, e.message] };
    }
  }

  private async findUser(user: UserModel) {
    return await this.prisma.user.findFirst({
      where: {
        ...user,
      },
    });
  }

  async isPasswordValid(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, userPassword);
  }
  // Encode User's password
  async encodePassword(password: string): Promise<string> {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hash(password, salt);
  }

  async sendLog(log: LogDTO): Promise<void> {
    return this.loggerClient
      .emit('LOG_CREATE', { ...log, service: 'AUTH' })
      .toPromise();
  }

  async verification(
    payload: AccountVerificationRequestDTO,
  ): Promise<ResponseDTO> {
    const user = await this.prisma.user.findFirst({
      where: { email: payload.email, verificationCode: payload.code },
    });
    if (!user) {
      return { status: HttpStatus.BAD_REQUEST, error: [''] };
    } else if (user.verified) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: ['Account already verified'],
      };
    }
    await this.prisma.user.update({
      where: { email: payload.email },
      data: {
        verified: true,
      },
    });
    return { status: HttpStatus.OK };
  }

  async sendAnotherCode(payload: { email: string }) {
    console.log(payload);
    let user = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (!user) {
      return { status: HttpStatus.BAD_REQUEST, error: [''] };
    } else if (user.verified) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: ['Account already verified'],
      };
    }
    const code = Math.floor(100000 + Math.random() * 999999).toString();
    user = await this.prisma.user.update({
      where: { email: payload.email },
      data: {
        verificationCode: code,
      },
    });
    console.log('code');
    await this.mailerService.sendVerificationMail(user);
  }
}
