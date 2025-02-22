import { Component, inject, input, model, signal } from '@angular/core';
import { CategoriesDTO, CategoryApi, TagComponent } from 'src/entities/category';

@Component({
  selector: 'app-category-selector',
  templateUrl: './category-selector.widget.html',
  styles: `
    :host {
      height: 100%;
      flex-grow: 1;
    }
  `,
  imports: [TagComponent],
})
export class CategorySelectorWidget {
  private readonly categoryApi = inject(CategoryApi);

  isMultiSelect = input<boolean>(true);
  selectedCategoryList = model<CategoriesDTO[]>([]);
  categoryList = signal<(CategoriesDTO & { selected: boolean })[]>([]);

  constructor() {
    this.categoryApi.fetchCategories().subscribe((res) => {
      this.categoryList.set(
        res.map((category) => ({
          ...category,
          selected: this.selectedCategoryList().some((fav: CategoriesDTO) => fav.id === category.id),
        })),
      );
    });
  }

  // 카테고리 선택/해제 토글
  toggleCategory(categoryId: number) {
    this.categoryList.update((categories) => {
      if (this.isMultiSelect()) {
        return categories.map((category) => {
          if (category.id === categoryId) {
            return {
              ...category,
              selected: !category.selected,
            };
          } else {
            return category;
          }
        });
      } else {
        return categories.map((category) => ({
          ...category,
          selected: category.id === categoryId ? !category.selected : false,
        }));
      }
    });

    this.selectedCategoryList.set(this.categoryList().filter((category) => category.selected));
  }
}
