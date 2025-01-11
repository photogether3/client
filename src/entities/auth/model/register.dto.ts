export type RegisterDTO = {
  email: string;
  password: string;
};

export type OtpDTO = {
  email: string;
  otp: string;
  deviceId: string;
  deviceModel: string;
  deviceOs: string;
};
