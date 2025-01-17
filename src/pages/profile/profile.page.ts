import { Component, inject } from '@angular/core';
import { UserApi } from 'src/entities/user';
import { ProfileType } from 'src/entities/user/model/user.type';
import { ModalService } from 'src/shared/components';
import { EditNicknameDialog, EditPasswordDialog } from './ui';

@Component({
  selector: 'profile-page',
  templateUrl: './profile.page.html',
  imports: [],
})
export class ProfilePage {
  public profile: ProfileType | undefined = undefined;

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

    this.updatePassword();
  }

  updateNickname() {
    this.modalService.open(EditNicknameDialog, this.profile?.nickname).subscribe((res) => {
      console.log(res);
    });
  }

  updatePassword() {
    this.modalService.open(EditPasswordDialog).subscribe((res) => {
      console.log(res);
    });
  }
}
