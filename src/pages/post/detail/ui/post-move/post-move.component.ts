import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { CollectionApi, CollectionType } from 'src/entities/collection';
import { PostApi, PostMoveReqDTO } from 'src/entities/post';
import { CollectionCardComponent } from 'src/pages/home';
import { BottomSheetService, ButtonComponent, ModalReactiveService } from 'src/shared/components';
import { SystemFoldersComponent } from 'src/widgets/system-folders/system-folders.component';

@Component({
  selector: 'post-move',
  templateUrl: './post-move.component.html',
  imports: [ButtonComponent, CollectionCardComponent, CommonModule, SystemFoldersComponent],
})
export class PostMoveComponent {
  private readonly bottomSheetService = inject(BottomSheetService);
  private readonly modalReactiveService = inject(ModalReactiveService);
  private readonly collectionApi = inject(CollectionApi);
  private readonly postApi = inject(PostApi);
  private readonly router = inject(Router);

  postIds: number[] = [];
  defaultCollections = signal<CollectionType[]>([]);
  hasSystemFolders = signal<boolean>(false);
  selectedCollectionId = signal<number | null>(null);

  constructor() {
    const { postIds, hasSystemFolders } = this.bottomSheetService.data();
    this.postIds = [...postIds];
    this.hasSystemFolders.set(hasSystemFolders);

    effect(() => {
      console.log(this.postIds, 'postIds');
    });

    effect(() => {
      console.log(this.selectedCollectionId(), '선택된 사진첩');
    });

    this.collectionApi.getCollections().subscribe((collections) => {
      const _default = collections.filter((c) => c.type === 'DEFAULT');
      this.defaultCollections.set(_default);

      if (this.hasSystemFolders()) {
        const _uncategorized = collections.find((c) => c.type === 'UNCATEGORIZED')?.id;
        console.log(_uncategorized);
        this.selectedCollectionId.set(_uncategorized ?? null);
      }
    });
  }

  onCardChecked(collectionId?: number) {
    if (!collectionId) {
      return;
    }
    const isSame = this.selectedCollectionId() === collectionId;
    this.selectedCollectionId.set(isSame ? null : collectionId);
  }

  movePost() {
    const postMoveDTO = {
      postIds: [...this.postIds],
      collectionId: this.selectedCollectionId(),
    } as PostMoveReqDTO;

    this.postApi.movePost(postMoveDTO).subscribe({
      next: () => {
        const modalData = {
          iconName: 'modal-photo',
          subTitle: '게시물 이동이 완료되었습니다.',
          content: '확인 버튼을 누르시면 홈화면으로 돌아갑니다. 확인버튼을 눌러주세요.',
          buttons: ['확인'],
        };

        this.modalReactiveService.open(modalData).then(() => {
          this.bottomSheetService.close();
          this.router.navigateByUrl('/home');
        });
      },
    });
  }
}
