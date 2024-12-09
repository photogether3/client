import { FormControl } from "@angular/forms";

export type LoginFormT = {
  username: FormControl<string>,
  password: FormControl<string>,
}