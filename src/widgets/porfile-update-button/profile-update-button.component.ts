import { Component, inject, input, output } from '@angular/core';

import { forkJoin } from 'rxjs';

import { CategoryApi } from 'src/entities/category';
import { UserApi } from 'src/entities/user';
import { ProfileUpdateFormType } from 'src/entities/user/model/user.type';
import { ButtonComponent } from 'src/shared/components';

@Component({
  selector: 'app-profile-update-button',
  templateUrl: './profile-update-button.component.html',
  imports: [ButtonComponent],
})
export class ProfileUpdateButton {
  private readonly categoryApi = inject(CategoryApi);
  private readonly userApi = inject(UserApi);

  form = input.required<ProfileUpdateFormType>();
  buttonText = input<string>('');
  handleButton = output<void>();

  updateProfile() {
    const { nickname, bio, file, categoryIds } = this.form();
    const updateProfileDTO = {
      nickname: nickname ?? '',
      bio: bio ?? '',
      file: file ?? null,
    };

    console.log(updateProfileDTO);

    const updateCategoryDTO = {
      categoryIds: categoryIds ?? [],
    };

    forkJoin({
      profile: this.userApi.updateProfile(updateProfileDTO),
      favCategories: this.categoryApi.updateFavCategories(updateCategoryDTO),
    }).subscribe(() => {
      this.handleButton.emit();
    });
  }
}
