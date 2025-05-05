import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserApi } from 'src/entities/user';
import { PasswordUpdateType } from 'src/entities/user/model/user.type';
import { ButtonComponent, InputComponent, ModalReactiveService } from 'src/shared/components';
import { PASSWORD_REGEX } from 'src/shared/const';
import { BaseForm } from 'src/shared/lib';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';

@Component({
  selector: 'app-password-update',
  templateUrl: './password-update.page.html',
  imports: [ReactiveFormsModule, InputComponent, HeaderWidget, FooterWidget, ButtonComponent],
  host: {
    class: 'flex flex-col h-screen',
  },
})
export class PasswordUpdatePage extends BaseForm<PasswordUpdateType> {
  private readonly userApi = inject(UserApi);
  private readonly modalReactiveService = inject(ModalReactiveService);
  private readonly router = inject(Router);

  constructor() {
    super();

    this.errorMessages = {
      currentPassword: {
        required: '기존 비밀번호는 필수입니다.',
        pattern: '8~15자이며, 숫자, 영문자, 특수문자를 포함해야 합니다.',
      },
      password: {
        required: '새 비밀번호는 필수입니다.',
        pattern: '8~15자이며, 숫자, 영문자, 특수문자를 포함해야 합니다.',
      },
      confirmPassword: {
        required: '새 비밀번호 확인은 필수입니다.',
        pattern: '8~15자이며, 숫자, 영문자, 특수문자를 포함해야 합니다.',
        fieldMismatch: '비밀번호가 일치하지 않습니다.',
      },
    };
  }

  protected override initForm(): void {
    this.form = this.fb.group({
      currentPassword: this.fb.control('', {
        validators: [Validators.pattern(PASSWORD_REGEX)],
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
      if (!res) {
        throw new Error('비밀번호 변경에 실패했습니다.');
      }

      const modalData = {
        iconName: 'modal-lock',
        subTitle: '비밀번호 변경이 완료 되었습니다.',
        content: '확인 버튼을 누르시면 홈화면으로 돌아갑니다. 확인버튼을 눌러주세요.',
        buttons: ['확인'],
      };

      this.modalReactiveService.open(modalData).then(() => {
        this.router.navigateByUrl('/home');
      });
    });
  }
}
