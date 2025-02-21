export type ProfileGetDTO = {
  id: number;
  nickname: string;
  email: string;
  imageUrl: string | null;
  bio: string | null;
  updatedAt: Date;
  createdAt: Date;
};

export type UpdateNicknameDTO = {
  nickname: string;
};

export type UpdatePasswordDTO = {
  currentPassword: string;
  newPassword: string;
};

export type UpdateProfileDTO = {
  nickname: string;
  bio: string;
  file: File | null;
};
