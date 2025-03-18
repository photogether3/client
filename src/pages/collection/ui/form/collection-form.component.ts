import { Component, input, OnInit, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategorySelectorWidget } from 'src/widgets/category-selector';

import { CategoriesGetDTO, TagComponent } from 'src/entities/category';
import { CollectionFormType } from 'src/entities/collection';
import { ButtonComponent, InputComponent } from 'src/shared/components';
import { BaseForm } from 'src/shared/lib';

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
export class CollectionFormComponent extends BaseForm<CollectionFormType> implements OnInit {
  submitForm = output<FormGroup>();
  mode = input.required<string>();
  title = input<string>();
  categoryId = input<number>();

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.mode() === 'update' && this.title() && this.categoryId()) {
      this.form.patchValue({
        title: this.title(),
        categoryId: this.categoryId(),
      });
    }
  }

  protected initForm() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      categoryId: [0, Validators.required],
    });
  }

  // 카테고리 클릭 시
  toggleCategory(category: number[]) {
    this.form.patchValue({ categoryId: category[0] });
  }

  // 폼 제출
  onSubmit() {
    this.submitForm.emit(this.form);
  }
}
