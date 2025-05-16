import { Component, inject, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TagComponent } from 'src/entities/category';
import { PostService, PostType } from 'src/entities/post';
import { BottomSheetService, ButtonComponent, IconComponent, ModalReactiveService } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';
import { ActionButtonsComponent, ActionButtonType } from 'src/widgets/action-buttons';

import { PostMoveComponent } from './ui';

@Component({
  selector: 'post-detail-page',
  templateUrl: './post-detail.page.html',
  imports: [ButtonComponent, FooterWidget, TagComponent, HeaderWidget, IconComponent],
})
export class PostDetailPage {
  private readonly bottomSheetService = inject(BottomSheetService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly postService = inject(PostService);
  private readonly modalReactiveService = inject(ModalReactiveService);

  collectionId: string | undefined = undefined;
  post: PostType | undefined = undefined;

  constructor() {
    const postId = this.route.snapshot.paramMap.get('id') as string;
    this.collectionId = this.router.getCurrentNavigation()?.extras.state?.['collectionId'];

    this.postService.getPost(postId).subscribe((res) => {
      if (!res) {
        throw new Error('게시물을 찾을 수 없습니다.');
      }
      this.post = {
        ...res,
        metadataList: res.metadataList.filter((meta) => meta.isPublic),
      };
    });
  }

  goPage() {
    this.router.navigateByUrl(`collection/${this.collectionId}`);
  }

  isLink(content: string): boolean {
    return /^(https?:\/\/)?(www\.)?[a-z0-9-]+\.[a-z]{2,}([/?].*)?$/i.test(content.trim());
  }

  getHref(content: string): string {
    return content.startsWith('http') ? content : `https://${content}`;
  }

  async openBottomSheet() {
    const actionButtons: ActionButtonType[] = [
      {
        type: 'organize',
        icon: 'album',
        text: '게시물 정리',
        appearance: 'primary',
      },
      {
        type: 'update',
        icon: 'post',
        text: '게시물 수정',
        appearance: 'secondary',
      },
      {
        type: 'delete',
        icon: 'trash',
        text: '게시물 삭제',
        appearance: 'danger',
      },
    ];
    const result = await this.bottomSheetService.open(ActionButtonsComponent as Type<Component>, actionButtons);

    switch (result) {
      case 'update':
        return this.router.navigateByUrl(`post/update/${this.post!.id}`);
      case 'organize':
        return this.bottomSheetService.open(PostMoveComponent as Type<Component>, {
          postIds: [this.post?.id],
          hasSystemFolders: true,
        });
      case 'delete':
        const modalData = {
          iconName: 'modal-trash',
          subTitle: '선택한 게시물을 삭제합니다.',
          content: '이 작업은 되돌릴 수 없습니다. 삭제를 원하지 않을 경우 취소를 눌러주세요.',
          buttons: ['취소', '삭제'],
        };

        const result = await this.modalReactiveService.open(modalData);
        if (result !== '삭제' || !this.post?.id) {
          return;
        }

        return this.postService.deletePost([this.post?.id]).subscribe({
          next: () => {
            const modalData = {
              title: '게시물 삭제 완료',
              subTitle: '게시물 삭제가 완료되었습니다.',
              content: '확인 버튼을 누르시면 홈화면으로 돌아갑니다. 확인버튼을 눌러주세요.',
              buttons: ['확인'],
            };

            this.modalReactiveService.open(modalData).then(() => {
              this.router.navigateByUrl('/home');
            });
          },
        });
      default:
        return;
    }
  }
}
