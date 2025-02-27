import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, map, of } from 'rxjs';
import { UserApi } from 'src/entities/user';
import { PasswordUpdateType } from 'src/entities/user/model/user.type';
import { ButtonComponent, InputComponent, ModalService } from 'src/shared/components';
import { PASSWORD_REGEX } from 'src/shared/const';
import { BaseForm } from 'src/shared/lib';

@Component({
  selector: 'password-update-dialog',
  templateUrl: './password-update-dialog.component.html',
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent],
})
export class PasswordUpdateDialog extends BaseForm<PasswordUpdateType> {
  private readonly userApi = inject(UserApi);
  private readonly modalService = inject(ModalService);

  constructor() {
    super();

    this.errorMessages = {
      currentPassword: {
        required: '기존 비밀번호는 필수입니다.',
        pattern: '비밀번호는 8~15자이며, 숫자, 영문자, 특수문자를 포함해야 합니다.',
      },
      password: {
        required: '새 비밀번호는 필수입니다.',
        pattern: '비밀번호는 8~15자이며, 숫자, 영문자, 특수문자를 포함해야 합니다.',
      },
      confirmPassword: {
        required: '새 비밀번호 확인은 필수입니다.',
        pattern: '비밀번호는 8~15자이며, 숫자, 영문자, 특수문자를 포함해야 합니다.',
        fieldMismatch: '비밀번호가 일치하지 않습니다.',
      },
    };
  }

  protected override initForm(): void {
    this.form = this.fb.group({
      currentPassword: this.fb.control('', {
        validators: [Validators.required, Validators.pattern(PASSWORD_REGEX)],
      }),
      password: this.fb.control('', {
        validators: [Validators.required, Validators.pattern(PASSWORD_REGEX)],
      }),
      confirmPassword: this.fb.control('', {
        validators: [Validators.required, Validators.pattern(PASSWORD_REGEX)],
        asyncValidators: [this.validationService.validateMatchingFields('password', 'confirmPassword')],
      }),
    });
  }

  updatePassword() {
    const { currentPassword, password } = this.getRawValue();
    const dto = { currentPassword, newPassword: password };

    this.userApi
      .updatePassword(dto)
      .pipe(
        map(() => true),
        catchError(() => of(false)),
      )
      .subscribe((res) => {
        this.modalService.close(res);
      });
  }
}
