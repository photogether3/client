import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { filter, forkJoin, map, switchMap } from 'rxjs';
import { AuthApi, AuthService } from 'src/entities/auth';
import { CategoriesGetDTO, CategoryApi, TagComponent } from 'src/entities/category';
import { ProfileGetDTO, UserApi } from 'src/entities/user';
import { ButtonComponent, ModalReactiveService, ModalService } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';
import { PasswordUpdateDialog } from '../ui';
import { HeaderWidget } from 'src/widgets/header';

@Component({
  selector: 'profile-page',
  templateUrl: './profile.page.html',
  imports: [TagComponent, ButtonComponent, FooterWidget, HeaderWidget],
})
export class ProfilePage {
  public profile: (ProfileGetDTO & { tags: CategoriesGetDTO[] }) | undefined = undefined;

  private readonly router = inject(Router);
  private readonly modalService = inject(ModalService);
  private readonly modalReactiveService = inject(ModalReactiveService);
  private readonly authApi = inject(AuthApi);
  private readonly userApi = inject(UserApi);
  private readonly categoryApi = inject(CategoryApi);

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

  // 비밀번호 변경
  // TODO 비밀번호 변경 실패했을 때 보여줘야 함
  updatePassword() {
    this.modalService
      .open(PasswordUpdateDialog)
      .pipe(
        map((res) => res ?? false),
        filter((res) => res === true),
        switchMap(() => {
          const modalData = {
            title: '비밀번호 변경 완료',
            subTitle: '비밀번호 변경이 완료되었습니다.',
            content: '확인 버튼을 누르시면 프로필 화면으로 돌아갑니다.',
            buttons: ['확인'],
          };
          return this.modalReactiveService.open(modalData);
        }),
      )
      .subscribe(() => {
        this.router.navigateByUrl('/profile');
      });
  }

  // 로그아웃
  onLogout() {
    this.authApi.logout().subscribe(() => {
      const instance = AuthService.getInstance();
      instance.clear();
      this.router.navigateByUrl('login');
    });
  }

  // 프로필 수정 페이지 이동
  goUpdatePage() {
    this.router.navigateByUrl('/profile/update');
  }

  // 기록 초기화
  reset() {
    alert('기능 개발중 ..');
  }

  // 회원탈퇴
  withdraw() {
    alert('기능 개발중 ...');
  }
}
