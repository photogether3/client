import { FormControl } from '@angular/forms';

export type ProfileType = {
  id: string;
  nickname: string;
  email: string;
  createdAt: string;
  tags: string[];
  content: string;
  image: string;
};

export type EditPasswordType = {
  email: FormControl<string>;
  otp: FormControl<string>;
  password: FormControl<string>;
};
