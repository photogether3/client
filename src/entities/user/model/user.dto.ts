export type ProfileDTO = {
  id: string;
  nickname: string;
  email: string;
  createdAt: string;
};

export type UpdateNicknameDTO = {
  nickname: string;
};

export type UpdatePasswordDTO = {
  email: string;
  otp: string;
  password: string;
};
