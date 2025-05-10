import { Component, inject, Type, viewChild } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { forkJoin } from 'rxjs';

import { CategoriesGetDTO, CategoryApi, TagComponent } from 'src/entities/category';
import { UserApi } from 'src/entities/user';
import { BottomSheetService, ButtonComponent, ModalReactiveService } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';
import { ProfileUpdateForm } from 'src/widgets/profile-update-form';
import { ProfileUpdateButton } from 'src/widgets/profile-update-button';

import { CategoriesUpdateDialog } from '../ui';

@Component({
  selector: 'profile-update-page',
  templateUrl: './profile-update.page.html',
  imports: [TagComponent, ButtonComponent, FooterWidget, ProfileUpdateForm, HeaderWidget, ProfileUpdateButton],
})
export class ProfileUpdatePage {
  private readonly router = inject(Router);
  private readonly userApi = inject(UserApi);
  private readonly categoryApi = inject(CategoryApi);
  private readonly bottomSheetService = inject(BottomSheetService);
  private readonly modalReactiveService = inject(ModalReactiveService);

  profileForm = viewChild.required<ProfileUpdateForm>('profileForm');

  get categories() {
    return this.profileForm().form.get('categories') as FormArray<FormControl<CategoriesGetDTO>>;
  }

  constructor() {
    forkJoin({
      profile: this.userApi.getProfile(),
      categories: this.categoryApi.fetchFavCategories(),
    }).subscribe(({ profile, categories }) => {
      this.profileForm().form.patchValue({
        nickname: profile.nickname,
        bio: profile.bio ?? '',
        file: null,
        previewUrl: profile.imageUrl,
      });
      categories.forEach((c) => this.categories.push(new FormControl(c, { nonNullable: true })));
    });
  }

  async updateCategory() {
    const data = {
      type: 'all',
      selectedCategories: this.categories.value,
    };

    const result = await this.bottomSheetService.open(CategoriesUpdateDialog as Type<Component>, data);

    if (!result) {
      return;
    }

    this.categories.clear();
    result.forEach((c: CategoriesGetDTO) => this.categories.push(new FormControl(c, { nonNullable: true })));
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
