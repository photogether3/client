import { Component, inject } from '@angular/core';
import { CategoriesDTO, CategoryApi } from 'src/entities/category';
import { BottomSheetService, ButtonComponent, TagComponent } from 'src/shared/components';

@Component({
  selector: 'categories-update-dialog',
  templateUrl: './categories-update-dialog.component.html',
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
        selected: categoryArray.some((fav: CategoriesDTO) => fav.categoryId === category.categoryId),
      }));
    });
  }

  // 태그 토글
  toggleCategory(categoryId: string) {
    const category = this.categoryList.find((category) => category.categoryId === categoryId);

    if (category) {
      category.selected = !category.selected;
    }
  }

  // 태그 선택 완료
  completed() {
    const updatedCategories = this.categoryList.filter((category) => category.selected).map((category) => ({ categoryId: category.categoryId, name: category.name }));
    this.bottomSheetService.close(updatedCategories);
  }
}
