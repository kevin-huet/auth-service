import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from '../../user/user.service';
import { UserAuthDto } from '../../user/user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { id: number; exp: number; iat: number }) {
    console.log(payload);
    if (payload.id) {
      const user = await this.userService.findOne({
        id: payload.id,
      });
      const { password, IPsLogged, verificationCode, ...rest } = user;
      return { ...rest, iat: payload.iat, exp: payload.exp } as UserAuthDto;
    }
    return null;
  }
}
