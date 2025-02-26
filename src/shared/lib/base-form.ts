import { inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControls } from './bade-form.type';
import { VALIDATION_SERVICE } from './validation.service';

export abstract class BaseForm<T> {
  form!: FormGroup<FormControls<T>>;

  protected readonly fb = inject(FormBuilder);
  protected readonly validationService = inject(VALIDATION_SERVICE);
  protected errorMessages: Partial<Record<string, Record<string, string>>> = {};

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

  // TODO input 컴포넌트에서 에러 메시지 처리
  getErrorMessage(controlName: keyof T): string | null {
    const control = this.form.get(controlName as string);

    if (!control || !control.dirty || !this.errorMessages[controlName as string]) {
      return null;
    }

    const firstErrorKey = Object.keys(control.errors || {})[0];
    return this.errorMessages[controlName as string]?.[firstErrorKey] || null;
  }
}
