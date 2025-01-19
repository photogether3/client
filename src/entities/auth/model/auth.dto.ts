export type loginDTO = {
  email: string;
  password: string;
};

export type RegisterDTO = {
  email: string;
  password: string;
};

export type GenerateOtpDTO = {
  email: string;
};

export type VerifyOtpDTO = {
  email: string;
  otp: string;
};

export type jwtSourceDTO = {
  status: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
};
