export class LoginRequestDTO {
  email: string;
  password: string;
}

export class RegisterRequestDTO {
  email: string;
  username: string;
  password: string;
}

export class AccountVerificationRequestDTO {
  email: string;
  code: string;
}

export class ValidateRequestDTO {
  token: string;
}

export class ResponseDTO {
  status: number;
  error?: Array<string>;
  userId?: number;
  token?: string;
  user?: object;
}

export class LogDTO {
  name?: string;
  description?: string;
  type?: string;
  service?: string;
}
