import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserApi } from 'src/entities/user';
import { PasswordUpdateType } from 'src/entities/user/model/user.type';
import { ButtonComponent } from 'src/shared/components';
import { PASSWORD_REGEX } from 'src/shared/const';
import { CustomValidators } from 'src/shared/validators';

@Component({
  selector: 'password-update-dialog',
  templateUrl: './password-update-dialog.component.html',
  imports: [ReactiveFormsModule, ButtonComponent, JsonPipe],
})
export class PasswordUpdateDialog {
  public passwordUpdateForm!: FormGroup;

  private readonly fb = inject(FormBuilder);
  private readonly customValidators = inject(CustomValidators);
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
        asyncValidators: [this.customValidators.checkPasswordMatch()],
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
