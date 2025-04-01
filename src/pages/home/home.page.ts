import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import { filter, forkJoin, switchMap, tap } from 'rxjs';

import { CategoryApi } from 'src/entities/category';
import { CollectionApi, CollectionType } from 'src/entities/collection';
import { UserApi } from 'src/entities/user';
import { ButtonComponent, IconComponent, SearchBarComponent } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';
import { ThemeService } from 'src/shared/services';

import { CollectionCardComponent } from './ui';

@Component({
  selector: 'home-page',
  templateUrl: './home.page.html',
  imports: [FooterWidget, IconComponent, CollectionCardComponent, ButtonComponent, CommonModule, HeaderWidget, SearchBarComponent],
})
export class HomePage implements OnInit {
  readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly userApi = inject(UserApi);
  private readonly categoryApi = inject(CategoryApi);
  private readonly collectionApi = inject(CollectionApi);

  nickname: string = '';
  collectionList: CollectionType[] = [];
  searchValue = signal<string>('');

  get myCollections() {
    return {
      default: this.collectionList?.filter((collection) => collection.type === 'DEFAULT'),
      uncategorized: this.collectionList?.find((collection) => collection.type === 'UNCATEGORIZED'),
      trash: this.collectionList?.find((collection) => collection.type === 'TRASH'),
    };
  }

  get systemFolders() {
    return [
      {
        label: '미분류',
        name: 'uncategorized',
        postCount: this.myCollections.uncategorized?.postCount,
      },
      {
        label: '휴지통',
        name: 'trash',
        postCount: this.myCollections.trash?.postCount,
      },
    ];
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
        this.collectionList = collections;
      });
  }

  createCollection() {
    this.router.navigateByUrl('collection/create');
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  goPage(type: string) {
    this.router.navigateByUrl(`collection/${type}`);
  }
}
