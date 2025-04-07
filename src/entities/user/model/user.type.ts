import { CategoriesGetDTO } from 'src/entities/category';

export type ProfileFormType = {
  nickname: string;
  bio: string;
  file: File | null;
  previewUrl: string | null;
  categories: CategoriesGetDTO[];
};

export type PasswordUpdateType = {
  currentPassword: string;
  password: string;
  confirmPassword: string;
};

export type PasswordForgotType = {
  password: string;
  confirmPassword: string;
};
