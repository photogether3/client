import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserApi } from 'src/entities/user';
import { EditPasswordType } from 'src/entities/user/model/user.type';
import { ModalService } from 'src/shared/components';
import { OTP_REGEX, PASSWORD_REGEX } from 'src/shared/const';

@Component({
  selector: 'edit-password-dialog',
  templateUrl: './edit-password-dialog.component.html',
  imports: [ReactiveFormsModule],
})
export class EditPasswordDialog {
  public passwordEditForm!: FormGroup;

  private fb = inject(FormBuilder);
  private readonly userApi = inject(UserApi);
  private readonly modalService = inject(ModalService);

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
