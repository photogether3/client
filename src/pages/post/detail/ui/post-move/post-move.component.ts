import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { CollectionService } from 'src/entities/collection';
import { PostMoveReqDTO, PostService } from 'src/entities/post';
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
  private readonly collectionService = inject(CollectionService);
  private readonly postService = inject(PostService);
  private readonly router = inject(Router);

  collections = this.collectionService.collections;

  postIds: number[] = [];
  hasSystemFolders = signal<boolean>(false);
  selectedCollectionId = signal<number | undefined>(undefined);

  constructor() {
    const { postIds, hasSystemFolders } = this.bottomSheetService.data();
    this.postIds = [...postIds];
    this.hasSystemFolders.set(hasSystemFolders);

    if (this.hasSystemFolders()) {
      this.selectedCollectionId.set(this.collections()?.unCategorized?.id);
    }
  }

  onCardChecked(collectionId?: number) {
    if (!collectionId) {
      return;
    }
    const isSame = this.selectedCollectionId() === collectionId;
    this.selectedCollectionId.set(isSame ? undefined : collectionId);
  }

  movePost() {
    const postMoveDTO = {
      postIds: [...this.postIds],
      collectionId: this.selectedCollectionId(),
    } as PostMoveReqDTO;

    this.postService.movePost(postMoveDTO).subscribe({
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
