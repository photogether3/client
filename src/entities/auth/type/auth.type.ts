import { FormControl } from "@angular/forms";

export type LoginFormT = {
  username: FormControl<string>,
  password: FormControl<string>,
}

export type SignUpFormT = {
  email: FormControl<string>,
  password: FormControl<string>,
}