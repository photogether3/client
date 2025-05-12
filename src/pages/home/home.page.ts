import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, Type } from '@angular/core';
import { Router } from '@angular/router';

import { filter, forkJoin, switchMap, tap } from 'rxjs';

import { CategoriesGetDTO, CategoryApi } from 'src/entities/category';
import { CollectionService } from 'src/entities/collection';
import { UserApi } from 'src/entities/user';
import { BottomSheetService, ButtonComponent, IconComponent } from 'src/shared/components';
import { ThemeService } from 'src/shared/services';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';
import { SystemFoldersComponent } from 'src/widgets/system-folders/system-folders.component';

import { CategoriesUpdateDialog } from '../profile';
import { CollectionCardComponent } from './ui';

@Component({
  selector: 'home-page',
  templateUrl: './home.page.html',
  imports: [FooterWidget, IconComponent, CollectionCardComponent, ButtonComponent, CommonModule, HeaderWidget, SystemFoldersComponent],
  host: {
    class: 'flex h-screen flex-col',
  },
})
export class HomePage {
  private readonly themeService = inject(ThemeService);
  private readonly collectionService = inject(CollectionService);
  private readonly router = inject(Router);
  private readonly userApi = inject(UserApi);
  private readonly categoryApi = inject(CategoryApi);
  private readonly bottomSheetService = inject(BottomSheetService);

  nickname: string = '';
  filteredCategory = signal<CategoriesGetDTO[]>([]);
  searchValue = signal<string>('');
  isDeleted = signal<boolean>(false);

  collections = this.collectionService.collections;

  constructor() {
    this.loadCollections();

    effect(() => {
      const isDeleted = this.isDeleted();
      if (!isDeleted) {
        return;
      }

      this.loadCollections();
    });
  }

  createCollection() {
    this.router.navigateByUrl('collection/create');
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  async openBottomSheet() {
    const result: CategoriesGetDTO[] = await this.bottomSheetService.open(CategoriesUpdateDialog as Type<Component>, {
      selectedCategories: this.filteredCategory(),
    });

    if (!result) {
      return;
    }
    this.filteredCategory.set(result);
  }

  private loadCollections() {
    this.collectionService.getCollections().subscribe();

    this.categoryApi
      .fetchFavCategories()
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
