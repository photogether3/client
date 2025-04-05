import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ProfileFormType } from 'src/entities/user/model/user.type';
import { IconComponent, InputComponent } from 'src/shared/components';
import { BaseForm, FormControls } from 'src/shared/lib';

@Component({
  selector: 'app-profile-update-form',
  templateUrl: './profile-update-form.component.html',
  imports: [IconComponent, InputComponent, ReactiveFormsModule],
})
export class ProfileUpdateForm extends BaseForm<ProfileFormType> {
  get previewUrl() {
    return this.form.get('previewUrl')?.value;
  }

  constructor() {
    super();
  }

  protected override initForm(): void {
    this.form = this.fb.group({
      nickname: new FormControl(''),
      bio: new FormControl(''),
      file: new FormControl<File | null>(null),
      previewUrl: new FormControl<string | null>(null),
      categories: new FormArray<FormGroup<FormControls<{ id: number; name: string }>>>([]),
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.form.patchValue({ file });

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          this.form.patchValue({ previewUrl: result });
        }
      };

      reader.readAsDataURL(file);
    }
  }
}
