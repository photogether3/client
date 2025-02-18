import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthApi, AuthService } from 'src/entities/auth';
import { CategoriesDTO, CategoryApi, TagComponent } from 'src/entities/category';
import { ProfileDTO, UserApi } from 'src/entities/user';
import { ButtonComponent, ModalService } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';
import { PasswordUpdateDialog } from '../ui';
import { HeaderWidget } from 'src/widgets/header';

@Component({
  selector: 'profile-page',
  templateUrl: './profile.page.html',
  imports: [TagComponent, ButtonComponent, FooterWidget, HeaderWidget],
})
export class ProfilePage {
  public profile: (ProfileDTO & { tags: CategoriesDTO[] }) | undefined = undefined;

  private readonly router = inject(Router);
  private readonly modalService = inject(ModalService);
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
  updatePassword() {
    this.modalService.open(PasswordUpdateDialog);
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
