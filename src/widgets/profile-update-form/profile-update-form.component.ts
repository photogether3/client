import { JsonPipe } from '@angular/common';
import { Component, effect, input } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ProfileUpdateFormType, ProfileInitFormType } from 'src/entities/user/model/user.type';
import { IconComponent, InputComponent } from 'src/shared/components';
import { BaseForm, FormControls } from 'src/shared/lib';

@Component({
  selector: 'app-profile-update-form',
  templateUrl: './profile-update-form.component.html',
  imports: [IconComponent, InputComponent, JsonPipe, ReactiveFormsModule],
})
export class ProfileUpdateForm extends BaseForm<ProfileUpdateFormType> {
  previewUrl: string | ArrayBuffer | null | undefined = null;
  profileInitForm = input<Partial<ProfileInitFormType> | undefined>(undefined);

  get categoryIds() {
    return this.form.get('categoryIds') as FormArray;
  }

  constructor() {
    super();

    effect(() => {
      console.log(this.profileInitForm());

      this.form.patchValue({
        nickname: this.profileInitForm()?.nickname,
        bio: this.profileInitForm()?.bio,
      });

      const categoryIds = this.profileInitForm()?.categoryIds ?? [];
      this.categoryIds.clear();
      categoryIds.forEach((id) => {
        this.categoryIds.push(new FormControl<number>(id));
      });

      this.previewUrl = this.profileInitForm()?.imageUrl;
    });
  }

  protected override initForm(): void {
    this.form = this.fb.group({
      nickname: new FormControl(''),
      bio: new FormControl(''),
      file: new FormControl<File | null>(null),
      categoryIds: this.fb.array<FormGroup<FormControls<number>>>([]),
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.form.patchValue({ file });

      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result;
      };

      reader.readAsDataURL(file);
      console.log(this.form.value);
    }
  }
}
