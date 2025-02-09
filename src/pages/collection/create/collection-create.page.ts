import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CollectionApi } from 'src/entities/collection';
import { CategoriesDTO, CategoryApi } from 'src/entities/category';
import { ButtonComponent, ModalReactiveService, TagComponent } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';

@Component({
  selector: 'app-collection-create',
  templateUrl: './collection-create.page.html',
  imports: [FooterWidget, ButtonComponent, TagComponent, ReactiveFormsModule],
})
export class CollectionCreatePage implements OnInit {
  public categoryList: CategoriesDTO[] = [];
  public collectionCreateForm!: FormGroup;

  private readonly fb = inject(FormBuilder);
  private readonly collectionApi = inject(CollectionApi);
  private readonly categoryApi = inject(CategoryApi);
  private readonly modalReactiveService = inject(ModalReactiveService);

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

  // 사진첩 생성
  createCollection() {
    const dto = this.collectionCreateForm.getRawValue();
    this.collectionApi.createCollection(dto).subscribe((res) => {
      console.log(res);

      const modalData = {
        title: '사진첩 생성 완료',
        subTitle: '사진첩 생성이 완료되었습니다.',
        content: '확인 버튼을 누르시면 홈화면으로 돌아갑니다. 확인버튼을 눌러주세요.',
        buttons: ['확인'],
      };
      this.modalReactiveService.open(modalData).subscribe((buttonText) => {
        console.log('선택된 버튼:', buttonText);
      });
    });
  }
}
