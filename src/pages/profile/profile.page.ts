import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApi, AuthService } from 'src/entities/auth';
import { UserApi } from 'src/entities/user';
import { ProfileType } from 'src/entities/user/model/user.type';
import { ButtonComponent, ModalService, TagComponent } from 'src/shared/components';
import { EditPasswordDialog } from './ui';

@Component({
  selector: 'profile-page',
  templateUrl: './profile.page.html',
  imports: [TagComponent, ButtonComponent],
})
export class ProfilePage {
  public profile: ProfileType | undefined = undefined;

  private readonly router = inject(Router);
  private readonly authApi = inject(AuthApi);
  private readonly userApi = inject(UserApi);
  private readonly modalService = inject(ModalService);

  constructor() {
    this.userApi.getProfile().subscribe((res) => {
      this.profile = {
        ...res,
        content: '임시 소개글입니다.',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHe6hYgyoH_DbL5N_2MWuG3jEwtw2lD7N4Zw&s',
        tags: ['건강', '뷰티', '런닝', '뜨개질'],
      };
    });
  }

  updatePassword() {
    this.modalService.open(EditPasswordDialog).subscribe((res) => {
      console.log(res);
    });
  }

  onLogout() {
    this.authApi.logout().subscribe((res) => {
      console.log(res);

      const instance = AuthService.getInstance();
      instance.clear();
      this.router.navigateByUrl('login');
    });
  }
}
