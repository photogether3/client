import { Component, inject, signal } from '@angular/core';

import { CategoriesGetDTO, CategoryService } from 'src/entities/category';
import { BottomSheetService, ButtonComponent } from 'src/shared/components';
import { CategorySelectorWidget } from 'src/widgets/category-selector';

@Component({
  selector: 'categories-update-dialog',
  templateUrl: './categories-update-dialog.component.html',
  imports: [CategorySelectorWidget, ButtonComponent],
  host: {
    class: 'h-full',
  },
  providers: [CategoryService],
})
export class CategoriesUpdateDialog {
  private readonly categoryService = inject(CategoryService);
  private readonly bottomSheetService = inject(BottomSheetService);

  selectedCategories = this.categoryService.selectedCategories;

  type = signal<'all' | 'fav'>('all');
  list = signal<CategoriesGetDTO[]>([]);

  constructor() {
    const { type, list } = this.bottomSheetService.data();
    this.type.set(type);
    this.list.set(list);
  }

  selectCategories() {
    this.bottomSheetService.close(this.selectedCategories());
  }
}
