export class UserDto {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export type UserAuthDto = {
  id: number;
  email: string;
  username: string;
  lastLoginAt: Date;
  terms: boolean;
  verified: boolean;
  iat?: number;
  exp?: number;
};
