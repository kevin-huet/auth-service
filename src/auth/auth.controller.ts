import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import {
  AccountVerificationRequestDTO,
  LoginRequestDTO,
  RegisterRequestDTO,
  ValidateRequestDTO,
} from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern('LOGIN')
  public async login(payload: LoginRequestDTO) {
    console.log(payload);
    return this.authService.login(payload);
  }

  @MessagePattern('REGISTER')
  public async register(payload: RegisterRequestDTO) {
    console.log(payload);
    return this.authService.register(payload);
  }

  @MessagePattern('VALIDATE')
  public async validate(payload: ValidateRequestDTO) {
    return this.authService.validate(payload);
  }

  @MessagePattern('VERIFY_CODE')
  public async verification(payload: AccountVerificationRequestDTO) {
    return this.authService.verification(payload);
  }

  @MessagePattern('SEND_ANOTHER_VERIFICATION_CODE')
  public async sendAnotherCode(payload: { email: string }) {
    return this.authService.sendAnotherCode(payload);
  }
}
