import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CategoriesDTO, CategoryApi, TagComponent } from 'src/entities/category';
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
  imports: [TagComponent, ReactiveFormsModule, InputComponent, ButtonComponent],
})
export class CollectionFormComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly categoryApi = inject(CategoryApi);

  public submitForm = output<FormGroup>();
  public mode = input.required<string>();
  public initForm = input<any>();
  public categoryList: CategoriesDTO[] = [];
  public form!: FormGroup<FormControls<CollectionFormType>>;

  constructor() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      categoryId: [0, Validators.required],
    });

    this.categoryApi.fetchFavCategories().subscribe((res) => {
      this.categoryList = res;
    });
  }

  ngOnInit(): void {
    if (this.mode() === 'update' && this.initForm()) {
      this.form.patchValue(this.initForm());
    }
  }
  // 카테고리 클릭 시
  clickCategory(categoryId: number) {
    this.form.patchValue({ categoryId });
  }

  // 폼 제출
  onSubmit() {
    this.submitForm.emit(this.form);
    console.log('form component', this.form);
  }
}
