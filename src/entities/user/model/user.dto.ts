export type ProfileDTO = {
  id: string;
  nickname: string;
  email: string;
  bio: string | null;
  updatedAt: Date;
  createdAt: Date;
};

export type UpdateNicknameDTO = {
  nickname: string;
};

export type UpdatePasswordDTO = {
  email: string;
  otp: string;
  password: string;
};

export type UpdateProfileDTO = {
  nickname: string;
  bio: string;
  categoryIds: string[];
};
