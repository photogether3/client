import { JsonPipe } from '@angular/common';
import { Component, inject, signal, Type } from '@angular/core';
import { Router } from '@angular/router';

import { forkJoin } from 'rxjs';

import { CategoriesGetDTO, CategoryApi, TagComponent } from 'src/entities/category';
import { UserApi } from 'src/entities/user';
import { BottomSheetService, ButtonComponent, InputComponent, ModalReactiveService } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';
import { ProfileUpdateButton } from 'src/widgets/porfile-update-button';
import { ProfileUpdateForm } from 'src/widgets/profile-update-form';

import { ProfileInitFormType, ProfileUpdateFormType } from 'src/entities/user/model/user.type';
import { CategoriesUpdateDialog } from '../ui';

@Component({
  selector: 'profile-update-page',
  templateUrl: './profile-update.page.html',
  imports: [TagComponent, ButtonComponent, FooterWidget, ProfileUpdateForm, HeaderWidget, InputComponent, ProfileUpdateButton, JsonPipe],
})
export class ProfileUpdatePage {
  private readonly router = inject(Router);
  private readonly userApi = inject(UserApi);
  private readonly categoryApi = inject(CategoryApi);
  private readonly bottomSheetService = inject(BottomSheetService);
  private readonly modalReactiveService = inject(ModalReactiveService);

  categories = signal<CategoriesGetDTO[]>([]);
  profileForm = signal<ProfileInitFormType>({
    nickname: '',
    bio: '',
    imageUrl: '',
    categoryIds: [],
  });
  updatedForm = signal<ProfileUpdateFormType>({
    nickname: '',
    bio: '',
    file: null,
    categoryIds: [],
  });

  constructor() {
    forkJoin({
      profile: this.userApi.getProfile(),
      categories: this.categoryApi.fetchFavCategories(),
    }).subscribe(({ profile, categories }) => {
      this.profileForm.set({
        nickname: profile.nickname,
        bio: profile.bio ?? '',
        imageUrl: profile.imageUrl ?? '',
        categoryIds: categories.map((c) => c.id),
      });
      this.categories.set(categories);
      console.log(this.categories());
    });
  }

  async updateCategory() {
    const result = await this.bottomSheetService.open(CategoriesUpdateDialog as Type<Component>, this.categories());

    this.profileForm.update((prev) => ({
      ...prev,
      categoryIds: result.map((category: CategoriesGetDTO) => category.id),
    }));
  }

  updateProfile() {
    const modalData = {
      title: '프로필 편집 완료',
      subTitle: '프로필 편집이 완료되었습니다.',
      content: '확인 버튼을 누르시면 홈 화면으로 돌아갑니다. 확인버튼을 눌러주세요.',
      buttons: ['확인'],
    };
    this.modalReactiveService.open(modalData).subscribe(() => {
      this.router.navigateByUrl('/profile');
    });
  }

  updateForm(updatedForm: ProfileUpdateFormType) {
    this.updatedForm.set(updatedForm);
  }
}
