import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UpdateNicknameDTO, UserApi } from 'src/entities/user';
import { ButtonComponent, ModalService } from 'src/shared/components';

@Component({
  selector: 'edit-nickname-dialog',
  templateUrl: './edit-nickname-dialog.component.html',
  imports: [ReactiveFormsModule, ButtonComponent],
})
export class EditNicknameDialog {
  public nicknameEditForm!: FormGroup;

  private fb = inject(FormBuilder);
  private readonly userApi = inject(UserApi);
  private readonly modalService = inject(ModalService);

  constructor() {
    this.nicknameEditForm = this.fb.group<UpdateNicknameDTO>({
      nickname: '',
    });

    this.nicknameEditForm.patchValue({ nickname: this.modalService.data });
  }

  updateNickname() {
    const formValue = this.nicknameEditForm.getRawValue();
    this.userApi.updateNickname(formValue).subscribe((res) => {
      console.log(res);
    });
  }
}
