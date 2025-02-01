import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AlbumApi, AlbumDTO } from 'src/entities/album';
import { UserApi } from 'src/entities/user';
import { ButtonComponent, IconComponent } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';
import { AlbumCardComponent } from './components';

@Component({
  selector: 'home-page',
  templateUrl: './home.page.html',
  imports: [FooterWidget, IconComponent, AlbumCardComponent, ButtonComponent, CommonModule],
})
export class HomePage {
  public nickname: string = '';
  public albumList: AlbumDTO[] | undefined = undefined;

  private readonly userApi = inject(UserApi);
  private readonly albumApi = inject(AlbumApi);

  constructor() {
    this.userApi.getProfile().subscribe((res) => {
      this.nickname = res.nickname;
    });

    this.albumApi.getCollections().subscribe((res) => {
      this.albumList = res;
    });
  }
}
