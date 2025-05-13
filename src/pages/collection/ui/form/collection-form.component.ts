import { Component, effect, inject, input } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';

import { CategoryService } from 'src/entities/category';
import { CollectionFormType } from 'src/entities/collection';
import { InputComponent } from 'src/shared/components';
import { BaseForm, FormControls } from 'src/shared/lib';
import { CategorySelectorWidget } from 'src/widgets/category-selector';

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
  imports: [ReactiveFormsModule, InputComponent, CategorySelectorWidget],
  providers: [CategoryService],
})
export class CollectionFormComponent extends BaseForm<CollectionFormType> {
  private readonly categoryService = inject(CategoryService);

  mode = input.required<string>();

  selectedCategories = this.categoryService.selectedCategories;

  constructor() {
    super();

    this.initForm();

    effect(() => {
      const category = this.selectedCategories()[0];

      requestAnimationFrame(() => {
        this.form.patchValue({ category });
      });
    });
  }

  protected initForm() {
    this.form = this.fb.group<FormControls<CollectionFormType>>({
      title: this.fb.control(null, [Validators.required]),
      category: this.fb.control(null, [Validators.required]),
    });
  }
}
