import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserApi } from 'src/entities/user';
import { EditPasswordType } from 'src/entities/user/model/user.type';
import { ButtonComponent } from 'src/shared/components';
import { OTP_REGEX, PASSWORD_REGEX } from 'src/shared/const';

@Component({
  selector: 'password-update-dialog',
  templateUrl: './password-update-dialog.component.html',
  imports: [ReactiveFormsModule, ButtonComponent],
})
export class PasswordUpdateDialog {
  public passwordEditForm!: FormGroup;

  private fb = inject(FormBuilder);
  private readonly userApi = inject(UserApi);

  constructor() {
    this.passwordEditForm = new FormGroup<EditPasswordType>({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        updateOn: 'change',
        nonNullable: true,
      }),
      otp: new FormControl('', {
        validators: [Validators.required, Validators.pattern(OTP_REGEX)],
        updateOn: 'change',
        nonNullable: true,
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.pattern(PASSWORD_REGEX)],
        updateOn: 'change',
        nonNullable: true,
      }),
    });
  }

  update() {
    const formValue = this.passwordEditForm.getRawValue();
    this.userApi.updatePassword(formValue).subscribe((res) => {
      console.log(res);
    });
  }
}
