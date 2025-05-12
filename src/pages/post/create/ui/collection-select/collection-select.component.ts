import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { forkJoin } from 'rxjs';

import { CollectionService } from 'src/entities/collection';
import { PostApi, PostCreateFormType } from 'src/entities/post';
import { UserApi } from 'src/entities/user';
import { CollectionCardComponent } from 'src/pages/home';
import { ButtonComponent, ModalReactiveService } from 'src/shared/components';
import { StepService } from 'src/shared/services';
import { FooterWidget } from 'src/widgets/footer';
import { SystemFoldersComponent } from 'src/widgets/system-folders/system-folders.component';

@Component({
  selector: 'app-collection-select',
  templateUrl: './collection-select.component.html',
  imports: [CollectionCardComponent, SystemFoldersComponent, FooterWidget, ButtonComponent],
  host: {
    class: 'flex  flex-1 flex-col bg-layer40',
  },
})
export class CollectionSelectComponent {
  private readonly router = inject(Router);
  private readonly postApi = inject(PostApi);
  private readonly userApi = inject(UserApi);
  private readonly collectionService = inject(CollectionService);
  private readonly stepService = inject(StepService);
  private readonly modalReactiveService = inject(ModalReactiveService);

  collections = this.collectionService.collections;

  nickname: string = '';
  postFormValue = signal<PostCreateFormType | undefined>(undefined);
  selectedCollectionId = signal<number | null>(null);

  constructor() {
    forkJoin({
      profile: this.userApi.getProfile(),
    }).subscribe(({ profile }) => {
      this.nickname = profile.nickname;

      const formValue = this.stepService.getExtraData('form');
      this.postFormValue.set({
        ...formValue,
        collectionId: this.collections()?.unCategorized?.id ?? 0,
      });
    });
  }

  onCardChecked(collectionId?: number) {
    if (!collectionId) {
      return;
    }

    const isSame = this.selectedCollectionId() === collectionId;
    this.selectedCollectionId.set(isSame ? null : collectionId);

    this.postFormValue.update((prev) => ({
      ...prev!,
      collectionId: isSame ? 0 : collectionId,
    }));
  }

  createPost() {
    const dto = this.postFormValue();

    if (!dto) {
      console.log('없어요');
      return;
    }

    this.postApi.createPost(dto).subscribe({
      next: () => {
        const modalData = {
          iconName: 'modal-photo',
          subTitle: '게시물 생성이 완료되었습니다.',
          content: '확인 버튼을 누르시면 홈 화면으로 돌아갑니다. 확인버튼을 눌러주세요.',
          buttons: ['확인'],
        };
        this.modalReactiveService.open(modalData).then(() => {
          this.router.navigateByUrl('/home');
        });
      },
    });
  }
}
