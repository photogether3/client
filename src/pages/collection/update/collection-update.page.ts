import { Component, inject, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CollectionApi } from 'src/entities/collection';
import { ButtonComponent, ModalReactiveService } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';

import { CollectionFormComponent } from '../ui';

@Component({
  selector: 'app-collection-update',
  templateUrl: './collection-update.page.html',
  imports: [FooterWidget, CollectionFormComponent, HeaderWidget, ButtonComponent],
})
export class CollectionUpdatePage {
  private readonly route = inject(ActivatedRoute);
  private readonly collectionApi = inject(CollectionApi);
  private readonly modalReactiveService = inject(ModalReactiveService);
  private readonly router = inject(Router);

  readonly collectionUpdateForm = viewChild.required<CollectionFormComponent>('collectionUpdateForm');
  collectionId?: string;

  constructor() {
    this.collectionId = this.route.snapshot.paramMap.get('id') as string;

    this.collectionApi.getCollection(this.collectionId).subscribe((res) => {
      if (!res || !res.category) return;

      this.collectionUpdateForm().form.patchValue({
        title: res.title,
        category: res.category,
      });
    });
  }

  // 사진첩 수정
  updateCollection() {
    const collectionUpdateDTO = this.collectionUpdateForm().getRawValue();

    if (!this.collectionId) return;

    const reqDTO = {
      title: collectionUpdateDTO.title,
      categoryId: collectionUpdateDTO.category.id,
    };

    this.collectionApi.updateCollection(this.collectionId, reqDTO).subscribe(() => {
      const modalData = {
        iconName: 'modal-create',
        subTitle: '사진첩 수정이 완료되었습니다.',
        content: '확인 버튼을 누르시면 홈 화면으로 돌아갑니다. 확인버튼을 눌러주세요.',
        buttons: ['확인'],
      };
      this.modalReactiveService.open(modalData).then(() => {
        this.router.navigateByUrl('/home');
      });
    });
  }
}
