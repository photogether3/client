import { FormControl } from '@angular/forms';

export type RegisterFormType = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginFormType = {
  email: string;
  password: string;
};

export type OtpFormType = {
  otp: FormControl<number | null>;
};

export type JwtResource = {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
};
