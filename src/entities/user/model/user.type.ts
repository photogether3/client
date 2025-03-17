export type ProfileUpdateFormType = {
  nickname: string;
  bio: string;
  file: File | null;
  categoryIds: number[];
};

export type ProfileInitFormType = {
  nickname: string;
  bio: string;
  imageUrl: string;
  categoryIds: number[];
};

export type PasswordUpdateType = {
  currentPassword: string;
  password: string;
  confirmPassword: string;
};
