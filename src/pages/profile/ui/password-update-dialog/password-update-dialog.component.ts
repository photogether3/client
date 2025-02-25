import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserApi } from 'src/entities/user';
import { PasswordUpdateType } from 'src/entities/user/model/user.type';
import { ButtonComponent, InputComponent, ModalReactiveService } from 'src/shared/components';
import { PASSWORD_REGEX } from 'src/shared/const';
import { BaseForm } from 'src/shared/lib';

@Component({
  selector: 'password-update-dialog',
  templateUrl: './password-update-dialog.component.html',
  imports: [ReactiveFormsModule, ButtonComponent, JsonPipe, InputComponent],
})
export class PasswordUpdateDialog extends BaseForm<PasswordUpdateType> {
  private readonly router = inject(Router);
  private readonly userApi = inject(UserApi);
  private readonly modalReactiveService = inject(ModalReactiveService);

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

    this.userApi.updatePassword(dto).subscribe((res) => {
      if (!res) return;

      const modalData = {
        title: '비밀번호 변경 완료',
        subTitle: '비밀번호 변경이 완료되었습니다.',
        content: '확인 버튼을 누르시면 프로필 화면으로 돌아갑니다.',
        buttons: ['확인'],
      };
      this.modalReactiveService.open(modalData).subscribe(() => {
        this.router.navigateByUrl('/profile');
      });
    });
  }
}
