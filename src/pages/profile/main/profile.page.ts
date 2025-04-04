import { Component, inject, Type } from '@angular/core';
import { Router } from '@angular/router';

import { forkJoin } from 'rxjs';

import { AuthApi, AuthService } from 'src/entities/auth';
import { CategoriesGetDTO, CategoryApi, TagComponent } from 'src/entities/category';
import { ProfileGetDTO, UserApi } from 'src/entities/user';
import { BottomSheetService, IconComponent } from 'src/shared/components';
import { ActionButtonsComponent, ActionButtonType } from 'src/widgets/action-buttons';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';

@Component({
  selector: 'profile-page',
  templateUrl: './profile.page.html',
  imports: [TagComponent, FooterWidget, HeaderWidget, IconComponent],
})
export class ProfilePage {
  private readonly router = inject(Router);
  private readonly bottomSheetService = inject(BottomSheetService);
  private readonly authApi = inject(AuthApi);
  private readonly userApi = inject(UserApi);
  private readonly categoryApi = inject(CategoryApi);

  profile: (ProfileGetDTO & { tags: CategoriesGetDTO[] }) | undefined = undefined;

  constructor() {
    forkJoin({
      profile: this.userApi.getProfile(),
      tags: this.categoryApi.fetchFavCategories(),
    }).subscribe(({ profile, tags }) => {
      this.profile = {
        ...profile,
        tags: tags,
      };
    });
  }

  onLogout() {
    this.authApi.logout().subscribe(() => {
      const instance = AuthService.getInstance();
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
        // TODO 개인정보 관리 모달 띄우기
        return console.log('adf');
      case 'logout':
        return this.onLogout();
    }

    this.bottomSheetService.open(ActionButtonsComponent as Type<Component>);
  }

  // TODO 비밀번호 변경 실패했을 때 보여줘야 함
  updatePassword() {
    // this.modalService
    //   .open(PasswordUpdateDialog)
    //   .pipe(
    //     map((res) => res ?? false),
    //     filter((res) => res === true),
    //     switchMap(() => {
    //       const modalData = {
    //         title: '비밀번호 변경 완료',
    //         subTitle: '비밀번호 변경이 완료되었습니다.',
    //         content: '확인 버튼을 누르시면 프로필 화면으로 돌아갑니다.',
    //         buttons: ['확인'],
    //       };
    //       return this.modalReactiveService.open(modalData);
    //     }),
    //   )
    //   .subscribe(() => {
    //     this.router.navigateByUrl('/profile');
    //   });
  }

  // TODO 기록초기화
  reset() {
    alert('기능 개발중 ..');
  }

  // TODO 회원탈퇴
  withdraw() {
    alert('기능 개발중 ...');
  }
}
