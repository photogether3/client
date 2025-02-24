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
  otp: string;
};

export type JwtResource = {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
};
