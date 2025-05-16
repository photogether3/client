import { Component, inject, Type, viewChild } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { forkJoin } from 'rxjs';

import { CategoriesGetDTO, CategoryService, TagComponent } from 'src/entities/category';
import { UserApi } from 'src/entities/user';
import { BottomSheetService, ButtonComponent, ModalReactiveService } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';
import { ProfileUpdateButton } from 'src/widgets/profile-update-button';
import { ProfileUpdateForm } from 'src/widgets/profile-update-form';

import { CategoriesUpdateDialog } from '../ui';

@Component({
  selector: 'profile-update-page',
  templateUrl: './profile-update.page.html',
  imports: [TagComponent, ButtonComponent, FooterWidget, ProfileUpdateForm, HeaderWidget, ProfileUpdateButton],
})
export class ProfileUpdatePage {
  private readonly router = inject(Router);
  private readonly userApi = inject(UserApi);
  private readonly categoryService = inject(CategoryService);
  private readonly bottomSheetService = inject(BottomSheetService);
  private readonly modalReactiveService = inject(ModalReactiveService);

  readonly selectedCategories = this.categoryService.selectedCategories;

  profileForm = viewChild.required<ProfileUpdateForm>('profileForm');

  get categories() {
    return this.profileForm().form.get('categories') as FormArray<FormControl<CategoriesGetDTO>>;
  }

  constructor() {
    forkJoin({
      profile: this.userApi.getProfile(),
      categories: this.categoryService.getFavCategories(),
    }).subscribe(({ profile, categories }) => {
      this.profileForm().form.patchValue({
        nickname: profile.nickname,
        bio: profile.bio ?? '',
        file: null,
        previewUrl: profile.imageUrl,
      });
      categories.forEach((c) => this.categories.push(new FormControl(c, { nonNullable: true })));

      const myCategories = this.categories.value.map((c) => ({ ...c, selected: true }));
      this.categoryService.setSelectedCategories(myCategories);
    });
  }

  async updateCategory() {
    const result = await this.bottomSheetService.open(CategoriesUpdateDialog as Type<Component>, 'all');

    if (!result) {
      return;
    }

    const newControls = result.map((c: any) => new FormControl<CategoriesGetDTO>(c, { nonNullable: true }));
    const newFormArray = new FormArray(newControls);

    this.profileForm().form.setControl('categories', newFormArray);
  }

  updateProfile() {
    const modalData = {
      title: '프로필 편집 완료',
      subTitle: '프로필 편집이 완료되었습니다.',
      content: '확인 버튼을 누르시면 프로필 화면으로 돌아갑니다. 확인버튼을 눌러주세요.',
      buttons: ['확인'],
    };
    this.modalReactiveService.open(modalData).then(() => {
      this.router.navigateByUrl('/profile');
    });
  }
}
