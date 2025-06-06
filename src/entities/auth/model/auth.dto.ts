export type loginDTO = {
  email: string;
  password: string;
};

export type RegisterDTO = {
  email: string;
  password: string;
  policyIds: number[];
};

export type RegisterKakaoDTO = {
  provider: string;
  providerId: string;
  providerEmail: string;
  policyIds: number[];
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

export type PoliciesDTO = {
  id: number;
  title: string;
  kind: string;
  version: string;
  isRequired: boolean;
  effectiveDate: Date;
  contentPreview: string;
  content: string;
};
