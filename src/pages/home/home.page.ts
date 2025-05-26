import { CommonModule } from '@angular/common';
import { Component, inject, signal, Type } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { combineLatest, debounceTime, distinctUntilChanged, filter, forkJoin, map, switchMap, tap } from 'rxjs';

import { CategoryService } from 'src/entities/category';
import { CollectionService } from 'src/entities/collection';
import { UserApi } from 'src/entities/user';
import { BottomSheetService, ButtonComponent, IconComponent, SearchBarComponent } from 'src/shared/components';
import { ThemeService } from 'src/shared/services';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';
import { SystemFoldersComponent } from 'src/widgets/system-folders/system-folders.component';

import { CategoriesUpdateDialog } from '../profile';
import { CollectionCardComponent } from './ui';

@Component({
  selector: 'home-page',
  templateUrl: './home.page.html',
  imports: [FooterWidget, IconComponent, CollectionCardComponent, ButtonComponent, CommonModule, HeaderWidget, SystemFoldersComponent, SearchBarComponent],
  providers: [CategoryService],
  host: {
    class: 'flex h-screen flex-col',
  },
})
export class HomePage {
  private readonly themeService = inject(ThemeService);
  private readonly collectionService = inject(CollectionService);
  private readonly router = inject(Router);
  private readonly userApi = inject(UserApi);
  private readonly categoryService = inject(CategoryService);
  private readonly bottomSheetService = inject(BottomSheetService);

  nickname: string = '';
  searchValue = signal<string>('');

  collections = this.collectionService.collections;
  selectedCategories = this.categoryService.selectedCategories;

  constructor() {
    this.loadCollections();

    const search$ = toObservable(this.searchValue).pipe(debounceTime(500), distinctUntilChanged());

    const categories$ = toObservable(this.selectedCategories).pipe(
      map((categories) => categories.map((c) => c.id)),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
    );

    combineLatest([search$, categories$])
      .pipe(
        switchMap(([keyword, categoryIds]) => {
          if (keyword.trim() === '' && categoryIds.length === 0) {
            return this.collectionService.getCollections();
          }
          return this.collectionService.getCollections(keyword, categoryIds);
        }),
      )
      .subscribe();
  }

  createCollection() {
    this.router.navigateByUrl('collection/create');
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  async openBottomSheet() {
    const result = await this.bottomSheetService.open(CategoriesUpdateDialog as Type<Component>, {
      type: 'fav',
      list: this.selectedCategories(),
    });

    if (!result) {
      return;
    }

    this.categoryService.setSelectedCategories(result);
  }

  private loadCollections() {
    this.categoryService
      .getFavCategories()
      .pipe(
        tap((res) => {
          if (res.length === 0) {
            this.router.navigateByUrl('/onboarding');
          }
        }),
        filter((res) => res.length > 0),
        switchMap(() =>
          forkJoin({
            profile: this.userApi.getProfile(),
          }),
        ),
      )
      .subscribe(({ profile }) => {
        this.nickname = profile.nickname;
      });
  }
}
