import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CollectionApi, CollectionsResDTO, CollectionType } from 'src/entities/collection';
import { UserApi } from 'src/entities/user';
import { ButtonComponent, IconComponent } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';
import { CollectionCardComponent } from './components';
import { HeaderWidget } from 'src/widgets/header';

@Component({
  selector: 'home-page',
  templateUrl: './home.page.html',
  imports: [FooterWidget, IconComponent, CollectionCardComponent, ButtonComponent, CommonModule, HeaderWidget],
})
export class HomePage {
  public nickname: string = '';
  // public collectionList: CollectionDTO[] | undefined = undefined;
  public collectionList: CollectionType[] | undefined = undefined;

  private readonly router = inject(Router);
  private readonly userApi = inject(UserApi);
  private readonly collectionApi = inject(CollectionApi);

  constructor() {
    this.userApi.getProfile().subscribe((res) => {
      this.nickname = res.nickname;
    });

    this.collectionApi.getCollections().subscribe((res: CollectionsResDTO) => {
      this.collectionList = res.items;
    });
  }

  // 사진첩 생성
  createCollection() {
    this.router.navigateByUrl('collection/create');
  }
}
