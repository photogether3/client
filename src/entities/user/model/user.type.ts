export type ProfileUpdateFormType = {
  nickname: string;
  bio: string;
  file: File | null;
  categoryIds: number[];
};

export type PasswordUpdateType = {
  currentPassword: string;
  password: string;
  confirmPassword: string;
};
