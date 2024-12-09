import { FormControl } from "@angular/forms";

export type LoginFormT = {
  username: FormControl<string>,
  password: FormControl<string>,
}

export type SignUpFormT = {
  name: FormControl<string>,
  email: FormControl<string>,
  password: FormControl<string>,
}