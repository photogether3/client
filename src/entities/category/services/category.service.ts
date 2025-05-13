import { computed, inject, Injectable, signal } from '@angular/core';

import { map, Observable, tap } from 'rxjs';

import { CategoryApi } from '../api';
import { CategoriesGetDTO, CategoryUpdateDTO } from '../model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly categoryApi = inject(CategoryApi);

  private _categories = signal<(CategoriesGetDTO & { selected: boolean })[]>([]);

  readonly categories = computed(() => this._categories());
  readonly selectedCategories = computed(() => this._categories().filter((c) => c.selected));

  getCategories(): Observable<CategoriesGetDTO[]> {
    return this.categoryApi.fetchCategories().pipe(
      map((res: CategoriesGetDTO[]) => res.map((item) => ({ ...item, selected: false }))),
      tap((res) => this._categories.set(res)),
    );
  }

  getFavCategories(): Observable<CategoriesGetDTO[]> {
    return this.categoryApi.fetchFavCategories().pipe(
      map((res: CategoriesGetDTO[]) => res.map((item) => ({ ...item, selected: false }))),
      tap((res) => this._categories.set(res)),
    );
  }

  updateFavCategories(categoryUpdateDto: CategoryUpdateDTO) {
    return this.categoryApi.updateFavCategories(categoryUpdateDto);
  }

  setSelectedCategories(categories: (CategoriesGetDTO & { selected: boolean })[]) {
    this._categories.set(categories);
  }

  toggle(id: number, multi: boolean = true) {
    this._categories.update((list) =>
      list.map((cat) => ({
        ...cat,
        selected: multi ? (cat.id === id ? !cat.selected : cat.selected) : cat.id === id,
      })),
    );
  }

  clearSelection() {
    this._categories.update((list) => list.map((cat) => ({ ...cat, selected: false })));
  }
}
