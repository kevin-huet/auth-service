import { User as UserModel } from 'prisma';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

export class MailerService {
  constructor(@Inject('MAILER_SERVICE') private mailerClient: ClientProxy) {}

  async sendVerificationMail(user: UserModel) {
    return this.mailerClient
      .emit('MAIL_SEND_CONFIRM_ACCOUNT', {
        email: user.email,
        username: user.username,
        code: user.verificationCode,
      })
      .toPromise();
  }
  async sendResetPassportMail() {}
}
