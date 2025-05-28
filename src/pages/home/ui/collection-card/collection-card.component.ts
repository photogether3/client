import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, inject, input, OnInit, output, signal, viewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';

import { TagComponent } from 'src/entities/category';
import { CollectionService, CollectionType } from 'src/entities/collection';
import { IconComponent, ModalReactiveService } from 'src/shared/components';
import { PopoverDirective } from 'src/shared/directives/popover.directive';

import { PopoverItemType } from '../popover';

@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  imports: [CommonModule, TagComponent, IconComponent, PopoverDirective],
})
export class CollectionCardComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly modalReactiveService = inject(ModalReactiveService);
  private readonly collectionService = inject(CollectionService);

  collection = input.required<CollectionType>();
  isCheckable = input<boolean>(false);
  isChecked = input<boolean>(false);

  popDirective = viewChild(PopoverDirective);

  clickEvent = output<number>();

  popoverBtn = viewChild.required<ElementRef<HTMLElement>>('popoverBtn');

  isPopoverOpen = signal<boolean>(false);
  imageLoadStatus = signal<boolean[]>([]);

  allImagesLoaded = computed(() => this.imageLoadStatus().every(Boolean));

  readonly popoverItems: PopoverItemType[] = [
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

  ngOnInit() {
    const count = this.collection().postCount;
    this.imageLoadStatus.set(Array(count).fill(false));
  }

  onImageLoaded(index: number) {
    const status = this.imageLoadStatus();
    status[index] = true;
    this.imageLoadStatus.set([...status]);
  }

  clickCard() {
    if (!this.isCheckable()) {
      this.goPage();
    } else {
      this.clickEvent.emit(this.collection().id);
    }
  }

  goPage() {
    if (this.isPopoverOpen()) return;

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
        if (!result || result !== '삭제') {
          return;
        }
        return this.collectionService.deleteCollection(this.collection().id).subscribe({
          next: () => {
            const modalData = {
              title: '사진첩 삭제 완료',
              subTitle: '사진첩 삭제가 완료되었습니다.',
              content: '확인 버튼을 누르시면 홈화면으로 돌아갑니다. 확인버튼을 눌러주세요.',
              buttons: ['확인'],
            };

            this.modalReactiveService.open(modalData).then(() => {
              this.popDirective()?.closePopover();
              this.router.navigateByUrl('/home');
            });
          },
        });

      case 'organize':
        // TODO 사진첩 내부로 이동, isEditMode 파라미터 전달
        return this.router.navigateByUrl(`collection/${this.collection().id}`);

      default:
        return;
    }
  }
}
