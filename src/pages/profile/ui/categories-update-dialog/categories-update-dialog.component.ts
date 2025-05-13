import { Component, inject, signal } from '@angular/core';

import { CategoryService } from 'src/entities/category';
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
  private readonly categoryService = inject(CategoryService);
  private readonly bottomSheetService = inject(BottomSheetService);

  selectedCategories = this.categoryService.selectedCategories;

  type = signal<'all' | 'fav'>('all');

  constructor() {
    const type = this.bottomSheetService.data();
    this.type.set(type);
  }

  selectCategories() {
    this.bottomSheetService.close(this.selectedCategories());
  }
}
