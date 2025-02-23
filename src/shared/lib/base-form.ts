import { inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControls } from './bade-form.type';
import { AUTH_VALIDATORS } from './interfaces/auth-validator';

export abstract class BaseForm<T> {
  form!: FormGroup<FormControls<T>>;

  protected readonly fb = inject(FormBuilder);
  protected errorMessages: Partial<Record<string, Record<string, string>>> = {};

  /**
   * DONE: fsd 규칙에 맞추어 수정됨.
   * 인터페이스를 참조하고, 실제 사용되는 구현체는 app.config 파일에서 명시
   * -> 런타임 시점에 구현체가 결정됨
   */
  protected readonly authValidators = inject(AUTH_VALIDATORS);

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