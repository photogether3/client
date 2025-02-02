import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlbumApi } from 'src/entities/album';
import { CategoriesDTO, CategoryApi } from 'src/entities/category';
import { ButtonComponent, TagComponent } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';

@Component({
  selector: 'app-album-create',
  templateUrl: './album-create.page.html',
  imports: [FooterWidget, ButtonComponent, TagComponent, ReactiveFormsModule],
})
export class AlbumCreatePage implements OnInit {
  public categoryList: CategoriesDTO[] = [];
  public collectionCreateForm!: FormGroup;

  private readonly fb = inject(FormBuilder);
  private readonly albumApi = inject(AlbumApi);
  private readonly categoryApi = inject(CategoryApi);

  constructor() {
    this.collectionCreateForm = this.fb.group({
      title: ['', Validators.required],
      categoryId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.categoryApi.fetchCategories().subscribe((res) => {
      this.categoryList = res;
    });
  }

  // 카테고리 클릭 시
  clickCategory(categoryId: string) {
    this.collectionCreateForm.patchValue({ categoryId });
  }
}
