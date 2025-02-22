import { Component, inject, signal } from '@angular/core';
import { CategoriesDTO } from 'src/entities/category';
import { BottomSheetService, ButtonComponent } from 'src/shared/components';
import { CategorySelectorWidget } from 'src/widgets/category-selector';

@Component({
  selector: 'categories-update-dialog',
  templateUrl: './categories-update-dialog.component.html',
  styles: `
    :host {
      height: 100%;
    }
  `,
  imports: [CategorySelectorWidget, ButtonComponent],
})
export class CategoriesUpdateDialog {
  private readonly bottomSheetService = inject(BottomSheetService);

  selectedCategoryList = signal(this.bottomSheetService.data);

  constructor() {}

  updateSelectedCategories(updatedList: CategoriesDTO[]) {
    this.selectedCategoryList.set(updatedList);
  }

  // 태그 선택 완료
  selectCategories() {
    this.bottomSheetService.close(this.selectedCategoryList());
  }
}
