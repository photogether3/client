import { Component, forwardRef, inject, input, OnInit, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { map } from 'rxjs';

import { CategoriesGetDTO, CategoryService, TagComponent } from 'src/entities/category';

@Component({
  selector: 'app-category-selector',
  templateUrl: './category-selector.widget.html',
  imports: [TagComponent],
  host: {
    class: 'h-full flex-1',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CategorySelectorWidget),
      multi: true,
    },
  ],
})
export class CategorySelectorWidget implements ControlValueAccessor, OnInit {
  private readonly categoryService = inject(CategoryService);

  type = input.required<'all' | 'fav'>();
  isMultiSelect = input<boolean>(true);
  selectedList = input<CategoriesGetDTO[]>([]);

  categoryList = this.categoryService.categories;

  /** CVA: 폼 바인딩용 internal value */
  private _formValue = signal<CategoriesGetDTO[]>([]);
  private _isFormMode = signal(false);

  // CVA 콜백
  private onChange: (v: CategoriesGetDTO[]) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {}

  ngOnInit() {
    const api$ = this.type() === 'all' ? this.categoryService.getCategories() : this.categoryService.getFavCategories();

    api$
      .pipe(
        map((list) => {
          const serviceSelIds = new Set(this.selectedList().map((c) => c.id));
          return list.map((item) => ({ ...item, selected: serviceSelIds.has(item.id) }));
        }),
      )
      .subscribe((mapped) => {
        this.categoryService.setSelectedCategories(mapped);
      });
  }

  onToggle(category: CategoriesGetDTO) {
    // 1. 폼 모드: _formValue가 있으면 폼 콜백만 호출
    if (this._isFormMode()) {
      let next: CategoriesGetDTO[];

      if (this.isMultiSelect()) {
        next = this._formValue().some((c) => c.id === category.id) ? this._formValue().filter((c) => c.id !== category.id) : [...this._formValue(), category];
      } else {
        next = [category];
      }

      this._formValue.set(next);
      const toEmit = this.isMultiSelect() ? next : (next[0] ?? null);

      this.onChange(toEmit as any);
    }

    // 2. 서비스 모드: 직접 토글
    this.categoryService.toggle(category.id, this.isMultiSelect());
  }

  // --- ControlValueAccessor 구현 ---
  writeValue(value: CategoriesGetDTO[] | CategoriesGetDTO): void {
    this._isFormMode.set(true);

    if (Array.isArray(value)) {
      this._formValue.set(value);
    } else if (value !== null) {
      this._formValue.set([value]);

      const selIds = new Set(this._formValue().map((c) => c.id));
      const mapped = this.categoryList().map((item) => ({ ...item, selected: selIds.has(item.id) }));

      this.categoryService.setSelectedCategories(mapped);
    } else {
      this._formValue.set([]);
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  // --------------------------------
}
