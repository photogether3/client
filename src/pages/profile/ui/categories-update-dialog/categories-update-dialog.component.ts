import { Component, inject } from '@angular/core';
import { CategoriesDTO, CategoryApi, TagComponent } from 'src/entities/category';
import { BottomSheetService, ButtonComponent } from 'src/shared/components';

@Component({
  selector: 'categories-update-dialog',
  templateUrl: './categories-update-dialog.component.html',
  styles: `
    :host {
      height: 100%;
    }
  `,
  imports: [TagComponent, ButtonComponent],
})
export class CategoriesUpdateDialog {
  public categoryList: (CategoriesDTO & { selected: boolean })[] = [];

  private readonly bottomSheetService = inject(BottomSheetService);
  private readonly categoryApi = inject(CategoryApi);

  constructor() {
    const categoryArray = this.bottomSheetService.data;

    this.categoryApi.fetchCategories().subscribe((res) => {
      this.categoryList = res.map((category) => ({
        ...category,
        selected: categoryArray.some((fav: CategoriesDTO) => fav.id === category.id),
      }));
    });
  }

  // 태그 토글
  toggleCategory(categoryId: number) {
    const category = this.categoryList.find((category) => category.id === categoryId);

    if (category) {
      category.selected = !category.selected;
    }
  }

  // 태그 선택 완료
  completed() {
    const updatedCategories = this.categoryList.filter((category) => category.selected);
    this.bottomSheetService.close(updatedCategories);
  }
}
