import { Component, inject, output } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { RegisterFormType } from 'src/entities/auth';
import { AuthValidators } from 'src/entities/auth/custom-validators';
import { UserApi } from 'src/entities/user';
import { InputComponent } from 'src/shared/components';
import { PASSWORD_REGEX } from 'src/shared/const';
import { BaseForm, FormControls } from 'src/shared/lib';
import { VALIDATION_SERVICE } from 'src/shared/lib/validation.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  imports: [ReactiveFormsModule, InputComponent],
  providers: [
    {
      provide: VALIDATION_SERVICE,
      useClass: AuthValidators,
    },
  ],
})
export class RegisterFormComponent extends BaseForm<RegisterFormType> {
  private readonly userApi = inject(UserApi);

  readonly isFormValid = output<boolean>();

  get policyIds() {
    return this.form.get('policyIds') as FormArray<FormControl<number>>;
  }

  constructor() {
    super();

    this.errorMessages = {
      email: {
        required: '이메일은 필수입니다.',
        email: '유효한 이메일 형식이 아닙니다.',
        duplicateEmail: '사용 중인 이메일입니다.',
      },
      password: {
        required: '비밀번호는 필수입니다.',
        pattern: '비밀번호는 8~15자이며, 숫자, 영문자, 특수문자를 포함해야 합니다.',
      },
      confirmPassword: {
        required: '비밀번호 확인은 필수입니다.',
        fieldMismatch: '비밀번호가 일치하지 않습니다.',
      },
    };

    this.form.statusChanges.subscribe(() => {
      this.isFormValid.emit(this.isValid());
    });

    [1, 2, 3].forEach((p) => this.policyIds.push(new FormControl(p, { nonNullable: true })));
  }

  protected override initForm() {
    this.form = this.fb.group({
      email: this.fb.control('', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.validationService.asyncValidateField((email) => this.userApi.checkDuplicatedEmail(email))],
      }),
      password: this.fb.control('', {
        validators: [Validators.required, Validators.pattern(PASSWORD_REGEX)],
      }),
      confirmPassword: this.fb.control('', {
        validators: [Validators.required],
        asyncValidators: [this.validationService.validateMatchingFields('password', 'confirmPassword')],
      }),
      policyIds: this.fb.array<FormGroup<FormControls<number>>>([]),
    });
  }
}
