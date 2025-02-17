import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CollectionApi } from 'src/entities/collection';
import { CategoriesDTO, CategoryApi } from 'src/entities/category';
import { ButtonComponent, ModalReactiveService, TagComponent } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';
import { ActivatedRoute } from '@angular/router';
import { HeaderWidget } from 'src/widgets/header';

@Component({
  selector: 'app-collection-update',
  templateUrl: './collection-update.page.html',
  imports: [FooterWidget, ButtonComponent, TagComponent, ReactiveFormsModule, HeaderWidget],
})
export class CollectionUpdatePage implements OnInit {
  public collectionId: string | undefined = undefined;
  public categoryList: CategoriesDTO[] = [];
  public collectionUpdateForm!: FormGroup;

  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly collectionApi = inject(CollectionApi);
  private readonly categoryApi = inject(CategoryApi);
  private readonly modalReactiveService = inject(ModalReactiveService);

  constructor() {
    this.collectionUpdateForm = this.fb.group({
      title: ['', Validators.required],
      categoryId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.collectionId = this.route.snapshot.paramMap.get('id') as string;

    this.collectionApi.getCollection(this.collectionId).subscribe((res) => {
      this.collectionUpdateForm.patchValue({
        title: res.title,
        categoryId: res.category.categoryId,
      });
    });

    this.categoryApi.fetchCategories().subscribe((res) => {
      this.categoryList = res;
    });
  }

  // 카테고리 클릭 시
  clickCategory(categoryId: string) {
    this.collectionUpdateForm.patchValue({ categoryId });
  }

  // 사진첩 수정
  updateCollection() {
    const dto = this.collectionUpdateForm.getRawValue();

    if (!this.collectionId) return;

    this.collectionApi.updateCollection(this.collectionId, dto).subscribe(() => {
      const modalData = {
        title: '사진첩 수정 완료',
        subTitle: '사진첩 수정이 완료되었습니다.',
        content: '확인 버튼을 누르시면 홈화면으로 돌아갑니다. 확인버튼을 눌러주세요.',
        buttons: ['확인'],
      };
      this.modalReactiveService.open(modalData).subscribe((buttonText) => {
        console.log('선택된 버튼:', buttonText);
      });
    });
  }
}
