import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { BottomSheetService, ButtonComponent, ModalReactiveService, ModalService } from 'src/shared/components';

@Component({
  selector: 'post-action',
  templateUrl: './post-action.component.html',
  imports: [ButtonComponent],
})
export class PostActionComponent {
  public collectionId: string | undefined = undefined;
  public postId: string | undefined = undefined;

  private readonly modalReactiveService = inject(ModalReactiveService);
  private readonly bottomSheetService = inject(BottomSheetService);
  private readonly router = inject(Router);

  constructor() {
    const { collectionId, postId } = this.bottomSheetService.data;
    this.collectionId = collectionId;
    this.postId = postId;

    // 페이지 이동 시 바텀시트 닫기
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.bottomSheetService.close();
    });
  }

  // 게시물 수정
  updatePost() {
    this.router.navigateByUrl(`post/update/${this.postId}`, {
      state: {
        postId: this.postId,
        collectionId: this.collectionId,
      },
    });
  }

  // 게시물 이동
  movePost() {
    // TODO 게시물 이동 바텀시트 열기
  }

  // 게시물 삭제
  deletePost() {
    const modalData = {
      title: '게시물 삭제',
      subTitle: '선택하신 게시물을 삭제합니다.',
      content: '삭제 버튼을 누르시면 해당 게시물이 삭제됩니다. 이 작업은 되돌릴 수 없습니다. 삭제를 원하지 않을 경우 취소 버튼을 눌러주세요.',
      buttons: ['취소', '확인'],
    };

    this.bottomSheetService.close();
    this.modalReactiveService.open(modalData).subscribe((buttonText) => {
      console.log('선택된 버튼:', buttonText);
    });
  }
}
