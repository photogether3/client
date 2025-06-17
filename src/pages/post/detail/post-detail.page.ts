import { CommonModule } from '@angular/common';
import { Component, inject, signal, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TagComponent } from 'src/entities/category';
import { PostService, PostType } from 'src/entities/post';
import { BottomSheetService, ButtonComponent, IconComponent, ModalReactiveService } from 'src/shared/components';
import { ActionButtonsComponent, ActionButtonType } from 'src/widgets/action-buttons';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';

import { PostMoveComponent } from './ui';

@Component({
  selector: 'post-detail-page',
  templateUrl: './post-detail.page.html',
  styles: `
    .carousel-container {
      width: 270px;
    }

    .carousel-wrapper {
      width: 270px;
      position: relative;
    }

    .carousel {
      display: flex;
      transition: transform 0.5s ease;
    }

    .cell {
      flex-shrink: 0;
    }

    .cell img {
      width: 270px;
      height: 500px;
      object-fit: cover;
      border-radius: 20px;
    }

    .nav-button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `,
  imports: [ButtonComponent, FooterWidget, TagComponent, HeaderWidget, IconComponent, CommonModule],
})
export class PostDetailPage {
  private readonly bottomSheetService = inject(BottomSheetService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly postService = inject(PostService);
  private readonly modalReactiveService = inject(ModalReactiveService);

  collectionId: string | undefined = undefined;

  post = signal<PostType | undefined>(undefined);
  images = signal<any[]>([]);
  currentIdx = signal(1);

  // readonly MAX_INDEX = this.images().length - 1;
  readonly IMAGE_WIDTH = 270;

  constructor() {
    this.route.queryParamMap.subscribe(params => {
      const collectionId = params.get('collectionId')
      this.collectionId = collectionId ?? '';
    })
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const postId = params.get('id');

      if (!postId) {
        this.router.navigateByUrl(`/collection/${this.collectionId}`);
        return;
      }

      this.loadPost(postId);
    });
  }

  goPage() {
    this.router.navigateByUrl(`collection/${this.post()?.collectionId}`);
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
        return this.router.navigateByUrl(`post/update/${this.post()!.id}`);
      case 'organize':
        return this.bottomSheetService.open(PostMoveComponent as Type<Component>, {
          postIds: [this.post()?.id],
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
        if (result !== '삭제' || !this.post()?.id) {
          return;
        }

        return this.postService.deletePost([this.post()!.id]).subscribe({
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

  /**
   *
   * 캐러셀 구현
   *
   */
  navigatePost(direction: 'prev' | 'next') {
    if (!this.post) return;

    const loadedPostId = direction === 'prev' ? this.post()!.prevPost.id : this.post()!.nextPost.id;
    this.router.navigate([`post/${loadedPostId}`], {
      queryParams: {
        collectionId: this.collectionId
      }
    });
  }

  getStyle(index: number) {
    const idx = this.currentIdx();
    const diff = index - idx;

    // 현재
    if (diff === 0) {
      return {
        transform: 'translateX(0) scale(1) rotateY(0deg)',
        opacity: '1',
        zIndex: '3',
      };
    }
    // 다음
    if (diff === 1) {
      return {
        transform: 'translateX(0px) scale(0.9) rotateY(-20deg)',
        opacity: '0.7',
        zIndex: '2',
      };
    }
    // 이전
    if (diff === -1) {
      return {
        transform: 'translateX(-0px) scale(0.9) rotateY(20deg)',
        opacity: '0.7',
        zIndex: '2',
      };
    }
    // 그 외
    return {
      transform: 'scale(0.6) rotateY(0deg)',
      opacity: '0.5',
      zIndex: '1',
    };
  }

  private loadPost(postId: string) {
    this.postService.getPost(postId).subscribe((res) => {
      if (!res) {
        throw new Error('게시물을 찾을 수 없습니다.');
      }

      this.post.set(res);
      this.loadImages(res.id);
    });
  }

  private loadImages(postId: number) {
    this.postService.getPostImages(this.collectionId!).subscribe(res => {
      this.images.set(res);

      const imageIdx = this.images().findIndex(image => image.id === postId);
      this.currentIdx.set(imageIdx);
    })
  }
}
