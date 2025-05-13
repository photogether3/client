import { Component, effect, inject, input, untracked } from '@angular/core';

import { map, take, tap } from 'rxjs';

import { CategoryService, TagComponent } from 'src/entities/category';

@Component({
  selector: 'app-category-selector',
  templateUrl: './category-selector.widget.html',
  imports: [TagComponent],
  styles: `
    :host {
      height: 100%;
      flex-grow: 1;
    }
  `,
})
export class CategorySelectorWidget {
  private readonly categoryService = inject(CategoryService);

  type = input.required<'all' | 'fav'>();
  isMultiSelect = input<boolean>(true);

  categoryList = this.categoryService.categories;
  selectedCategories = this.categoryService.selectedCategories;

  constructor() {
    // type()이 바뀔 때만 실행되고, selectedCategories() 변경은 트리거하지 않음
    effect(() => {
      const isAll = this.type() === 'all';
      const api$ = isAll ? this.categoryService.getCategories() : this.categoryService.getFavCategories();

      api$
        .pipe(
          map((list) => {
            const selected = untracked(() => this.selectedCategories());
            const selectedIds = new Set(selected.map((c) => c.id));
            const updatedList = list.map((item) => ({
              ...item,
              selected: selectedIds.has(item.id),
            }));
            console.log(updatedList);
            return updatedList;
          }),
          tap((res) => console.log(res)),
        )
        .subscribe((mapped) => {
          this.categoryService.setSelectedCategories(mapped);
        });
    });
  }

  onToggle(categoryId: number) {
    this.categoryService.toggle(categoryId, this.isMultiSelect());
  }
}
