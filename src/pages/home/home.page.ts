import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import { filter, forkJoin, switchMap, tap } from 'rxjs';

import { CategoryApi } from 'src/entities/category';
import { CollectionApi, CollectionType } from 'src/entities/collection';
import { UserApi } from 'src/entities/user';
import { ButtonComponent, IconComponent, SearchBarComponent } from 'src/shared/components';
import { ThemeService } from 'src/shared/services';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';
import { SystemFoldersComponent } from 'src/widgets/system-folders/system-folders.component';

import { CollectionCardComponent } from './ui';

@Component({
  selector: 'home-page',
  templateUrl: './home.page.html',
  imports: [FooterWidget, IconComponent, CollectionCardComponent, ButtonComponent, CommonModule, HeaderWidget, SearchBarComponent, SystemFoldersComponent],
})
export class HomePage implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly userApi = inject(UserApi);
  private readonly categoryApi = inject(CategoryApi);
  private readonly collectionApi = inject(CollectionApi);

  nickname: string = '';
  defaultCollections: CollectionType[] = [];
  searchValue = signal<string>('');

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
        this.defaultCollections = collections.filter((collection: CollectionType) => collection.type === 'DEFAULT');
      });
  }

  createCollection() {
    this.router.navigateByUrl('collection/create');
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
