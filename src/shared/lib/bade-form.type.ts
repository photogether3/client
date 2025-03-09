import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type FormControls<T> = {
  [K in keyof T]: T[K] extends Array<infer U> ? FormArray<FormGroup<FormControls<U>>> : FormControl<T[K] | null>;
};
