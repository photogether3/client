export type loginDTO = {
  email: string;
  password: string;
  deviceId: string;
};

export type RegisterDTO = {
  email: string;
  password: string;
};

export type OtpReqDTO = {
  email: string;
  otp: string;
  deviceId: string;
  deviceModel: string;
  deviceOs: string;
};

export type jwtSourceDTO = {
  status: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
};
