export type RegisterFormType = {
  email: string;
  password: string;
  confirmPassword: string;
  policyIds: number[];
};

export type LoginFormType = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type OtpFormType = {
  otp: string;
};

export type JwtResource = {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
};
