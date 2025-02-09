import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { BottomSheetService, ButtonComponent, ModalService } from 'src/shared/components';

@Component({
  selector: 'post-action',
  templateUrl: './post-action.component.html',
  imports: [ButtonComponent],
})
export class PostActionComponent {
  public collectionId: string | undefined = undefined;
  public postId: string | undefined = undefined;

  private readonly modalService = inject(ModalService);
  private readonly bottomSheetService = inject(BottomSheetService);
  private readonly router = inject(Router);

  constructor() {
    const { collecitionId, postId } = this.bottomSheetService.data;
    this.collectionId = collecitionId;
    this.postId = postId;

    // 페이지 이동 시 바텀시트 닫기
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.bottomSheetService.close();
    });
  }

  // 게시물 수정
  updatePost() {
    this.router.navigateByUrl(`post/update/${this.postId}`);
  }

  // 게시물 이동
  movePost() {
    // TODO 게시물 이동 바텀시트 열기
  }

  // 게시물 삭제
  deletePost() {
    const data = {
      title: '게시물 삭제',
      subTitle: '선택하신 게시물을 삭제합니다.',
      content: '삭제 버튼을 누르시면 해당 게시물이 삭제됩니다. 이 작업은 되돌릴 수 없습니다. 삭제를 원하지 않을 경우 취소 버튼을 눌러주세요.',
    };

    // TODO 게시물 삭제 모달 열기
    // this.modalService.open(CommonModalComponent, data).subscribe((res) => {
    //   console.log(res);
    // });
  }
}
