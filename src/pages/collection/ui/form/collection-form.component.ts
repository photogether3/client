import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategorySelectorWidget } from 'src/widgets/category-selector';

import { CategoriesDTO, TagComponent } from 'src/entities/category';
import { CollectionFormType, FormControls } from 'src/entities/collection';
import { ButtonComponent, InputComponent } from 'src/shared/components';

@Component({
  selector: 'app-collection-form',
  templateUrl: './collection-form.component.html',
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        height: 100%;
      }
    `,
  ],
  imports: [TagComponent, ReactiveFormsModule, InputComponent, ButtonComponent, CategorySelectorWidget],
})
export class CollectionFormComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);

  public submitForm = output<FormGroup>();
  public mode = input.required<string>();
  title = input.required<string>();
  category = input.required<CategoriesDTO>();
  public form!: FormGroup<FormControls<CollectionFormType>>;

  constructor() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      categoryId: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.mode() === 'update' && this.title() && this.category()) {
      this.form.patchValue({
        title: this.title(),
        categoryId: this.category()?.id,
      });
    }
  }

  // 카테고리 클릭 시
  toggleCategory(category: CategoriesDTO[]) {
    this.form.patchValue({ categoryId: category[0].id });
  }

  // 폼 제출
  onSubmit() {
    this.submitForm.emit(this.form);
  }
}
