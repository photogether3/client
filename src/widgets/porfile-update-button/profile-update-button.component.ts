import { Component, inject, input, output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CategoryApi } from 'src/entities/category';
import { UserApi } from 'src/entities/user';
import { ButtonComponent } from 'src/shared/components';

@Component({
  selector: 'app-profile-update-button',
  templateUrl: './profile-update-button.component.html',
  imports: [ButtonComponent],
})
export class ProfileUpdateButton {
  private readonly categoryApi = inject(CategoryApi);
  private readonly userApi = inject(UserApi);

  form = input.required<FormGroup>();
  buttonText = input<string>('');
  handleButton = output<void>();

  updateProfile() {
    const { nickname, bio, file, categoryIds, categories } = this.form().value;
    const updateProfileDTO = { nickname, bio, file };
    const updateCategoryDTO = { categoryIds: categoryIds ?? categories.map((c: any) => c.id) };

    forkJoin({
      profile: this.userApi.updateProfile(updateProfileDTO),
      favCategories: this.categoryApi.updateFavCategories(updateCategoryDTO),
    }).subscribe(() => {
      this.handleButton.emit();
    });
  }
}
