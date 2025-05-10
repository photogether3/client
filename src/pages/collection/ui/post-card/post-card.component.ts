import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, input, output, signal, Type, viewChild } from '@angular/core';
import { Router } from '@angular/router';

import { PostApi, PostType } from 'src/entities/post';
import { PopoverItemType } from 'src/pages/home';
import { PostMoveComponent } from 'src/pages/post';
import { BottomSheetService, IconComponent, ModalReactiveService } from 'src/shared/components';
import { PopoverDirective } from 'src/shared/directives';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  imports: [CommonModule, IconComponent, PopoverDirective],
})
export class PostCardComponent {
  private readonly router = inject(Router);
  private readonly postApi = inject(PostApi);
  private readonly modalReactiveService = inject(ModalReactiveService);
  private readonly bottomSheetService = inject(BottomSheetService);

  post = input.required<PostType>();
  isCheckable = input<boolean>(false);
  postSelected = output<number>();

  isPopoverOpen = signal<boolean>(false);

  checkboxRef = viewChild.required<ElementRef<HTMLInputElement>>('checkboxRef');
  popoverBtn = viewChild.required<ElementRef<HTMLElement>>('popoverBtn');

  readonly popoverItems: PopoverItemType[] = [
    {
      icon: 'album',
      label: '게시물 수정하기',
      color: 'text-white',
      action: () => this.onClick('update'),
    },
    {
      icon: 'upload',
      label: '게시물 이동하기',
      color: 'text-primary20',
      action: () => this.onClick('organize'),
    },
    {
      icon: 'trash',
      label: '게시물 삭제하기',
      color: 'text-accent40',
      action: () => this.onClick('delete'),
    },
  ];

  constructor() {}

  onCheckboxClick(event: Event) {
    event.stopPropagation();
    this.postSelected.emit(this.post().id);
  }

  onContainerClick() {
    if (this.isCheckable()) {
      this.checkboxRef().nativeElement.click();
    } else {
      this.router.navigateByUrl(`post/${this.post().id}`, {
        state: { collectionId: this.post().collectionId, postId: this.post().id },
      });
    }
  }

  async onClick(type: 'update' | 'organize' | 'delete') {
    switch (type) {
      case 'update':
        return this.router.navigateByUrl(`post/update/${this.post().id}`);

      case 'delete':
        const modalData = {
          iconName: 'modal-trash',
          subTitle: '선택한 게시물을 삭제합니다.',
          content: '이 작업은 되돌릴 수 없습니다. 삭제를 원하지 않을 경우 취소를 눌러주세요.',
          buttons: ['취소', '삭제'],
        };

        const result = await this.modalReactiveService.open(modalData);
        if (!result || result !== '삭제') {
          return;
        }

        return this.postApi.deletePost([this.post().id]).subscribe({
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

      case 'organize':
        return this.bottomSheetService.open(PostMoveComponent as Type<Component>, {
          postIds: [this.post().id],
          hasSystemFolders: false,
        });

      default:
        return this.closePopover();
    }
  }

  private closePopover() {
    this.isPopoverOpen.set(false);
  }
}
