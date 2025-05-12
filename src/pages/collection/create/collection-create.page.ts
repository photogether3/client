import { Component, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';

import { CollectionService } from 'src/entities/collection';
import { ButtonComponent, ModalReactiveService } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';

import { CollectionFormComponent } from '../ui';

@Component({
  selector: 'app-collection-create',
  templateUrl: './collection-create.page.html',
  imports: [FooterWidget, HeaderWidget, CollectionFormComponent, ButtonComponent],
  host: {
    class: 'flex h-screen flex-col',
  },
})
export class CollectionCreatePage {
  private readonly modalReactiveService = inject(ModalReactiveService);
  private readonly collectionService = inject(CollectionService);
  private readonly router = inject(Router);

  readonly collectionCreateForm = viewChild<CollectionFormComponent>('collectionCreateForm');

  constructor() {}

  // 사진첩 생성
  createCollection() {
    const collectionCreateDTO = this.collectionCreateForm()!.getRawValue();
    const reqDTO = {
      title: collectionCreateDTO.title,
      categoryId: collectionCreateDTO.category.id,
    };
    this.collectionService.createCollection(reqDTO).subscribe(() => {
      const modalData = {
        iconName: 'modal-create',
        subTitle: '사진첩 생성이 완료되었습니다.',
        content: '확인 버튼을 누르시면 홈화면으로 돌아갑니다. 확인버튼을 눌러주세요.',
        buttons: ['확인'],
      };

      this.modalReactiveService.open(modalData).then(() => {
        this.router.navigateByUrl('/home');
      });
    });
  }
}
