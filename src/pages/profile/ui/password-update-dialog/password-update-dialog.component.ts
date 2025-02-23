import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthValidators } from 'src/entities/auth/custom-validators';
import { UserApi } from 'src/entities/user';
import { PasswordUpdateType } from 'src/entities/user/model/user.type';
import { ButtonComponent, InputComponent } from 'src/shared/components';
import { PASSWORD_REGEX } from 'src/shared/const';

@Component({
  selector: 'password-update-dialog',
  templateUrl: './password-update-dialog.component.html',
  imports: [ReactiveFormsModule, ButtonComponent, JsonPipe, InputComponent],
})
export class PasswordUpdateDialog {
  public passwordUpdateForm!: FormGroup;

  private readonly fb = inject(FormBuilder);
  private readonly authValidators = inject(AuthValidators);
  private readonly userApi = inject(UserApi);

  constructor() {
    this.passwordUpdateForm = new FormGroup<PasswordUpdateType>({
      currentPassword: new FormControl('', {
        validators: [Validators.required, Validators.pattern(PASSWORD_REGEX)],
        updateOn: 'change',
        nonNullable: true,
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.pattern(PASSWORD_REGEX)],
        updateOn: 'change',
        nonNullable: true,
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required, Validators.pattern(PASSWORD_REGEX)],
        asyncValidators: [this.authValidators.checkPasswordMatch()],
        updateOn: 'change',
        nonNullable: true,
      }),
    });
  }

  updatePassword() {
    const { currentPassword, password } = this.passwordUpdateForm.getRawValue();
    const dto = { currentPassword, newPassword: password };

    this.userApi.updatePassword(dto).subscribe((res) => {
      console.log(res);
    });
  }
}
