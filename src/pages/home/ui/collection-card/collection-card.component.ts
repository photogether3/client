import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';

import { TagComponent } from 'src/entities/category';
import { CollectionApi, CollectionType } from 'src/entities/collection';
import { IconComponent, ModalReactiveService } from 'src/shared/components';
import { ClickOutsideDirective } from 'src/shared/directives';

import { PopoverComponent, PopoverItemType } from '../popover';

@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  imports: [CommonModule, TagComponent, IconComponent, PopoverComponent, ClickOutsideDirective],
})
export class CollectionCardComponent {
  private readonly router = inject(Router);
  private readonly modalReactiveService = inject(ModalReactiveService);
  private readonly collectionApi = inject(CollectionApi);

  collection = input.required<CollectionType>();
  isCheckable = input<boolean>(false);
  isChecked = input<boolean>(false);
  clickEvent = output<number>();
  isOpenPopover = signal<boolean>(false);
  readonly popoverItems: PopoverItemType[] = [
    // TODO 사진첩 정리 필요없는 기능 -> 삭제 확인
    {
      icon: 'album',
      label: '사진첩 정리',
      color: 'text-white',
      action: () => this.onClick('organize'),
    },
    {
      icon: 'post',
      label: '사진첩 수정',
      color: 'text-primary20',
      action: () => this.onClick('update'),
    },
    {
      icon: 'trash',
      label: '사진첩 삭제',
      color: 'text-accent40',
      action: () => this.onClick('delete'),
    },
  ];

  constructor() {}

  handlePopover(event: Event) {
    event.stopPropagation();
    this.isOpenPopover.update((prev) => !prev);
  }

  closePopover() {
    this.isOpenPopover.set(false);
  }

  clickCard() {
    if (!this.isCheckable()) {
      this.goPage();
    } else {
      this.clickEvent.emit(this.collection().id);
    }
  }

  goPage() {
    if (this.isOpenPopover()) return;

    const url = this.router.url;
    if (url.includes('home')) {
      this.router.navigateByUrl('collection/' + this.collection().id);
    } else {
      return;
    }
  }

  async onClick(type: 'update' | 'organize' | 'delete') {
    switch (type) {
      case 'update':
        return this.router.navigateByUrl(`collection/update/${this.collection().id}`);
      case 'delete':
        const modalData = {
          iconName: 'modal-trash',
          subTitle: '선택한 사진첩을 삭제합니다.',
          content: '이 작업은 되돌릴 수 없습니다. 삭제를 원하지 않을 경우 취소를 눌러주세요.',
          buttons: ['취소', '삭제'],
        };

        const result = await this.modalReactiveService.open(modalData);
        if (result !== '삭제') {
          return;
        }
        return this.collectionApi.deleteCollection(this.collection().id).subscribe({
          next: () => {
            const modalData = {
              title: '사진첩 삭제 완료',
              subTitle: '사진첩 삭제가 완료되었습니다.',
              content: '확인 버튼을 누르시면 홈화면으로 돌아갑니다. 확인버튼을 눌러주세요.',
              buttons: ['확인'],
            };

            this.modalReactiveService.open(modalData).then(() => {
              this.router.navigateByUrl('/home');
            });
          },
        });
      case 'organize':
        // TODO 사진첩 내부로 이동, isEditMode 파라미터 전달
        return this.router.navigateByUrl(`collection/${this.collection().id}`);
    }
  }
}
