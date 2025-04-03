import { Component, input } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';

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

  constructor() {
    super();
  }

  protected initForm() {
    this.form = this.fb.group<FormControls<CollectionFormType>>({
      title: this.fb.control(null, [Validators.required]),
      categoryId: this.fb.control(null, [Validators.required]),
    });
  }

  toggleCategory(category: number[]) {
    this.form.patchValue({ categoryId: category[0] });
  }
}
