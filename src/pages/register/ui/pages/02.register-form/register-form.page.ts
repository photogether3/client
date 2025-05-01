import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthApi, RegisterDTO, RegisterFormType } from 'src/entities/auth';
import { AuthValidators } from 'src/entities/auth/custom-validators';
import { UserApi } from 'src/entities/user';
import { RegisterStepService } from 'src/pages/register/services';
import { ButtonComponent, InputComponent } from 'src/shared/components';
import { PASSWORD_REGEX } from 'src/shared/const';
import { BaseForm, FormControls } from 'src/shared/lib';
import { VALIDATION_SERVICE } from 'src/shared/lib/validation.service';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';

@Component({
  selector: 'register-page',
  templateUrl: './register-form.page.html',
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent, HeaderWidget, FooterWidget],
  providers: [
    {
      provide: VALIDATION_SERVICE,
      useClass: AuthValidators,
    },
  ],
})
export class RegisterFormPage extends BaseForm<RegisterFormType> {
  /** -------------------------------------------------------
   * PRIVATE PROPERTIES
   * -------------------------------------------------------*/
  private readonly authApi = inject(AuthApi);
  private readonly userApi = inject(UserApi);

  private readonly registerStepService = inject(RegisterStepService);

  /** -------------------------------------------------------
   * PUBLIC PROPERTIES
   * -------------------------------------------------------*/

  readonly totalSteps = this.registerStepService.totalSteps;
  readonly currentStep = this.registerStepService.currentStep;

  constructor() {
    super();

    // 확인용으로 콘솔찍음
    const policyIds = this.registerStepService.getExtraData('policyIds');
    console.log(policyIds);

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
  }

  protected initForm() {
    this.form = this.fb.group({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.validationService.asyncValidateField((email) => this.userApi.checkDuplicatedEmail(email))],
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.pattern(PASSWORD_REGEX)],
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required],
        asyncValidators: [this.validationService.validateMatchingFields('password', 'confirmPassword')],
      }),
      policyIds: this.fb.array<FormGroup<FormControls<number>>>([]),
    });
  }

  onNext() {
    const formData = this.getRawValue();
    const policyIds = this.registerStepService.getExtraData('policyIds') as number[];

    const dto: RegisterDTO = {
      email: formData.email,
      password: formData.password,
      policyIds,
    };

    this.authApi.register(dto).subscribe(() => {
      this.registerStepService.setExtraData('email', formData.email).nextStep();
    });
  }
}
