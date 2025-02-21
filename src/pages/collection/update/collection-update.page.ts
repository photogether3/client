import { Component, inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionApi } from 'src/entities/collection';
import { ModalReactiveService } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';
import { CollectionFormComponent } from '../ui';

@Component({
  selector: 'app-collection-update',
  templateUrl: './collection-update.page.html',
  imports: [FooterWidget, CollectionFormComponent, HeaderWidget],
})
export class CollectionUpdatePage implements OnInit {
  public collectionId?: string;
  public collection?: { title: string; categoryId: number };

  private readonly route = inject(ActivatedRoute);
  private readonly collectionApi = inject(CollectionApi);
  private readonly modalReactiveService = inject(ModalReactiveService);
  private readonly router = inject(Router);

  constructor() {}

  ngOnInit(): void {
    this.collectionId = this.route.snapshot.paramMap.get('id') as string;

    this.collectionApi.getCollection(this.collectionId).subscribe((res) => {
      this.collection = { title: res.title, categoryId: res.category!.id };
    });
  }

  // 사진첩 수정
  updateCollection(formGroup: FormGroup) {
    const collectionUpdateDTO = formGroup.getRawValue();

    if (!this.collectionId) return;

    this.collectionApi.updateCollection(this.collectionId, collectionUpdateDTO).subscribe(() => {
      const modalData = {
        title: '사진첩 수정 완료',
        subTitle: '사진첩 수정이 완료되었습니다.',
        content: '확인 버튼을 누르시면 홈화면으로 돌아갑니다. 확인버튼을 눌러주세요.',
        buttons: ['확인'],
      };
      this.modalReactiveService.open(modalData).subscribe(() => {
        this.router.navigateByUrl('/home');
      });
    });
  }
}
