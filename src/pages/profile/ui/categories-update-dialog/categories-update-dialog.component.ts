import { Component, inject, signal } from '@angular/core';

import { CategoriesGetDTO } from 'src/entities/category';
import { BottomSheetService, ButtonComponent } from 'src/shared/components';
import { CategorySelectorWidget } from 'src/widgets/category-selector';

@Component({
  selector: 'categories-update-dialog',
  templateUrl: './categories-update-dialog.component.html',
  imports: [CategorySelectorWidget, ButtonComponent],
  host: {
    class: 'h-full',
  },
})
export class CategoriesUpdateDialog {
  private readonly bottomSheetService = inject(BottomSheetService);

  type = signal<'all' | 'fav'>('all');
  selectedCategoryList = signal<CategoriesGetDTO[]>([]);

  constructor() {
    const data = this.bottomSheetService.data();

    this.selectedCategoryList.set(data.selectedCategories);
    this.type.set(data.type);
  }

  updateSelectedCategories(updatedList: CategoriesGetDTO[]) {
    this.selectedCategoryList.set(updatedList);
  }

  selectCategories() {
    this.bottomSheetService.close(this.selectedCategoryList());
  }
}
