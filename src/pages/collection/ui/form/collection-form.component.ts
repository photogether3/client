import { Component, input } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';

import { CategoriesGetDTO } from 'src/entities/category';
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
})
export class CollectionFormComponent extends BaseForm<CollectionFormType> {
  mode = input.required<string>();

  get category() {
    return this.form.get('category')?.value ?? { id: 0, name: '' };
  }

  constructor() {
    super();
  }

  protected initForm() {
    this.form = this.fb.group<FormControls<CollectionFormType>>({
      title: this.fb.control(null, [Validators.required]),
      category: this.fb.control(null, [Validators.required]),
    });
  }

  toggleCategory(category: CategoriesGetDTO[]) {
    this.form.patchValue({ category: category[0] });
  }
}
