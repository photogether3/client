import { FormControl } from '@angular/forms';

export type RegisterFormType = {
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
};

export type LoginFormType = {
  email: FormControl<string>;
  password: FormControl<string>;
};

export type OtpFormType = {
  otp: FormControl<number | null>;
};

export type JwtResource = {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
};
