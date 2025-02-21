import { Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';

import { CollectionFormComponent } from '../ui';
import { CollectionApi } from 'src/entities/collection';
import { ModalReactiveService } from 'src/shared/components';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collection-create',
  templateUrl: './collection-create.page.html',
  imports: [FooterWidget, HeaderWidget, CollectionFormComponent],
})
export class CollectionCreatePage {
  private readonly modalReactiveService = inject(ModalReactiveService);
  private readonly collectionApi = inject(CollectionApi);
  private readonly router = inject(Router);

  constructor() {}

  // 사진첩 생성
  createCollection(formGroup: FormGroup) {
    const collectionCreateDTO = formGroup.getRawValue();
    this.collectionApi.createCollection(collectionCreateDTO).subscribe(() => {
      const modalData = {
        title: '사진첩 생성 완료',
        subTitle: '사진첩 생성이 완료되었습니다.',
        content: '확인 버튼을 누르시면 홈화면으로 돌아갑니다. 확인버튼을 눌러주세요.',
        buttons: ['확인'],
      };
      this.modalReactiveService.open(modalData).subscribe(() => {
        this.router.navigateByUrl('/home');
      });
    });
  }
}
