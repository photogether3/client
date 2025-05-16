import { Component, inject, input, output } from '@angular/core';

import { forkJoin } from 'rxjs';

import { CategoryService } from 'src/entities/category';
import { UserApi } from 'src/entities/user';
import { ProfileFormType } from 'src/entities/user/model/user.type';
import { ButtonComponent } from 'src/shared/components';

@Component({
  selector: 'app-profile-update-button',
  templateUrl: './profile-update-button.component.html',
  imports: [ButtonComponent],
})
export class ProfileUpdateButton {
  private readonly categoryService = inject(CategoryService);
  private readonly userApi = inject(UserApi);

  form = input.required<ProfileFormType>();
  buttonText = input<string>('');
  isDisabled = input<boolean>(false);
  handleButton = output<void>();

  updateProfile() {
    const { nickname, bio, file, categories } = this.form();
    const updateProfileDTO = {
      nickname: nickname ?? '',
      bio: bio ?? '',
      file: file ?? null,
    };

    console.log(updateProfileDTO);

    const updateCategoryDTO = {
      categoryIds: categories.map((c) => c.id) ?? [],
    };

    forkJoin({
      profile: this.userApi.updateProfile(updateProfileDTO),
      favCategories: this.categoryService.updateFavCategories(updateCategoryDTO),
    }).subscribe(() => {
      this.handleButton.emit();
    });
  }
}
