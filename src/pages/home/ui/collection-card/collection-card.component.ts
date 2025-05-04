import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, inject, input, OnInit, output, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { TagComponent } from 'src/entities/category';
import { CollectionApi, CollectionType } from 'src/entities/collection';
import { IconComponent, ModalReactiveService } from 'src/shared/components';

import { PopoverComponent, PopoverItemType } from '../popover';

@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  imports: [CommonModule, TagComponent, IconComponent],
})
export class CollectionCardComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly modalReactiveService = inject(ModalReactiveService);
  private readonly collectionApi = inject(CollectionApi);
  private readonly overlay = inject(Overlay);

  collection = input.required<CollectionType>();
  isCheckable = input<boolean>(false);
  isChecked = input<boolean>(false);
  clickEvent = output<number>();

  popoverBtn = viewChild<ElementRef<HTMLElement>>('popoverBtn');

  isPopoverOpen = signal<boolean>(false);
  imageLoadStatus = signal<boolean[]>([]);
  private overlayRef = signal<OverlayRef | null>(null);

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
        this.router.navigateByUrl(`collection/update/${this.collection().id}`);
        return this.closePopover();

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
        this.collectionApi.deleteCollection(this.collection().id).subscribe({
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
        return this.closePopover();

      case 'organize':
        // TODO 사진첩 내부로 이동, isEditMode 파라미터 전달
        this.router.navigateByUrl(`collection/${this.collection().id}`);
        return this.closePopover();

      default:
        return this.closePopover();
    }
  }

  togglePopover(event: MouseEvent) {
    event.stopPropagation();

    if (this.overlayRef()) {
      this.closePopover();
    } else {
      this.openPopover();
    }
  }

  private openPopover() {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.popoverBtn()!.nativeElement)
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
          offsetY: 4,
        },
      ]);

    const overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'transparent-backdrop',
      panelClass: 'z-[9999]',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    this.overlayRef.set(overlayRef);

    // 팝오버 닫힘 처리
    this.overlayRef()
      ?.backdropClick()
      .subscribe(() => this.closePopover());

    // PopoverComponent 를 동적으로 붙이기
    const portal = new ComponentPortal(PopoverComponent);
    const cmpRef = this.overlayRef()!.attach(portal);
    cmpRef.instance.items = this.popoverItems;

    this.isPopoverOpen.set(true);
  }

  private closePopover() {
    this.overlayRef()?.dispose();
    this.overlayRef.set(null);
    this.isPopoverOpen.set(false);
  }
}
