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

export type OtpResDTO = {
  status: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
};
