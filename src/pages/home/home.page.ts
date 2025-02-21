import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter, forkJoin, switchMap, tap } from 'rxjs';
import { CategoryApi } from 'src/entities/category';
import { CollectionApi, CollectionType } from 'src/entities/collection';
import { UserApi } from 'src/entities/user';
import { ButtonComponent, IconComponent } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';
import { CollectionCardComponent } from './components';

@Component({
  selector: 'home-page',
  templateUrl: './home.page.html',
  imports: [FooterWidget, IconComponent, CollectionCardComponent, ButtonComponent, CommonModule, HeaderWidget],
})
export class HomePage implements OnInit {
  public nickname: string = '';
  public collectionList: CollectionType[] = [];

  private readonly router = inject(Router);
  private readonly userApi = inject(UserApi);
  private readonly categoryApi = inject(CategoryApi);
  private readonly collectionApi = inject(CollectionApi);

  get myCollections() {
    return {
      default: this.collectionList.filter((collection) => collection.type === 'DEFAULT'),
      uncategorized: this.collectionList.find((collection) => collection.type === 'UNCATEGORIZED'),
      trash: this.collectionList.find((collection) => collection.type === 'TRASH'),
    };
  }

  constructor() {}

  ngOnInit(): void {
    this.categoryApi
      .fetchFavCategories()
      .pipe(
        tap((res) => {
          console.log(res);
          if (res.length === 0) {
            this.router.navigateByUrl('/onboarding');
          }
        }),
        filter((res) => res.length > 0),
        switchMap(() =>
          forkJoin({
            profile: this.userApi.getProfile(),
            collections: this.collectionApi.getCollections(),
          }),
        ),
      )
      .subscribe(({ profile, collections }) => {
        this.nickname = profile.nickname;
        this.collectionList = collections.items;
      });
  }

  // 사진첩 생성
  createCollection() {
    this.router.navigateByUrl('collection/create');
  }
}
