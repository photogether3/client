import { inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

export type FormControls<T> = {
  [K in keyof T]: FormControl<T[K]>;
};

export abstract class BaseForm<T> {
  protected fb = inject(FormBuilder);
  form!: FormGroup<FormControls<T>>;

  constructor() {
    this.initForm();
  }

  protected abstract initForm(): void;

  isValid(): boolean {
    return this.form.valid;
  }

  getRawValue(): T {
    return this.form.getRawValue() as unknown as T;
  }
}
