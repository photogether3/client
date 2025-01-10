import { FormControl } from "@angular/forms";

export type RegisterFormType = {
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

export type LoginFormType = {
  email: FormControl<string>;
  password: FormControl<string>;
}

