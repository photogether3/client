import { Component, inject, Type } from '@angular/core';
import { Router } from '@angular/router';

import { forkJoin } from 'rxjs';

import { AuthApi, TokenService } from 'src/entities/auth';
import { CategoriesGetDTO, CategoryService, TagComponent } from 'src/entities/category';
import { ProfileGetDTO, UserApi } from 'src/entities/user';
import { BottomSheetService, IconComponent, ModalService } from 'src/shared/components';
import { ActionButtonsComponent, ActionButtonType } from 'src/widgets/action-buttons';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';

import { AccountSettingComponent } from '../ui';

@Component({
  selector: 'profile-page',
  templateUrl: './profile.page.html',
  imports: [TagComponent, FooterWidget, HeaderWidget, IconComponent],
  host: {
    class: 'flex flex-col h-screen',
  },
})
export class ProfilePage {
  private readonly router = inject(Router);
  private readonly bottomSheetService = inject(BottomSheetService);
  private readonly authApi = inject(AuthApi);
  private readonly userApi = inject(UserApi);
  private readonly categoryService = inject(CategoryService);
  private readonly modalService = inject(ModalService);

  profile: (ProfileGetDTO & { categories: CategoriesGetDTO[] }) | undefined = undefined;

  constructor() {
    forkJoin({
      profile: this.userApi.getProfile(),
      categories: this.categoryService.getFavCategories(),
    }).subscribe(({ profile, categories }) => {
      this.profile = {
        ...profile,
        categories,
      };
    });
  }

  onLogout() {
    this.authApi.logout().subscribe(() => {
      const instance = TokenService.getInstance();
      instance.clear();
      this.router.navigateByUrl('login');
    });
  }

  async openBottomSheet() {
    const actionButtons: ActionButtonType[] = [
      {
        type: 'update',
        icon: 'post',
        text: '프로필 편집',
        appearance: 'primary',
      },
      {
        type: 'privacy',
        icon: 'user',
        text: '개인정보 관리',
        appearance: 'secondary',
      },
      {
        type: 'logout',
        icon: 'logout',
        text: '로그아웃',
        appearance: 'danger',
      },
    ];

    const result = await this.bottomSheetService.open(ActionButtonsComponent as Type<Component>, actionButtons);

    switch (result) {
      case 'update':
        return this.router.navigateByUrl('/profile/update');
      case 'privacy':
        return this.modalService.open(AccountSettingComponent).subscribe((res) => {
          if (res == 'withdraw') {
            this.withdraw();
          } else if (res === 'reset') {
            this.reset();
          } else {
            this.updatePassword();
          }
        });
      case 'logout':
        return this.onLogout();
      default:
        return;
    }
  }

  updatePassword() {
    this.router.navigateByUrl('password-update');
  }

  reset() {
    this.router.navigateByUrl('reset');
  }

  withdraw() {
    this.router.navigateByUrl('withdraw');
  }
}
