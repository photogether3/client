import { Component, computed, effect, ElementRef, inject, signal, Type, viewChild, viewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { forkJoin } from 'rxjs';

import { TagComponent } from 'src/entities/category';
import { CollectionApi, CollectionDetailResDTO } from 'src/entities/collection';
import { PostApi, PostType } from 'src/entities/post';
import { PostMoveComponent } from 'src/pages/post';
import { BottomSheetService, ButtonComponent, IconComponent, ModalReactiveService, SearchBarComponent } from 'src/shared/components';
import { ActionButtonsComponent, ActionButtonType } from 'src/widgets/action-buttons';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';

import { PostCardComponent } from '../ui';

@Component({
  selector: 'app-collection-main',
  templateUrl: './collection-main.page.html',
  imports: [TagComponent, FooterWidget, HeaderWidget, IconComponent, SearchBarComponent, PostCardComponent, ButtonComponent],
})
export class CollectionMainPage {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly collectionApi = inject(CollectionApi);
  private readonly postApi = inject(PostApi);
  private readonly bottomSheetService = inject(BottomSheetService);
  private readonly modalReactiveService = inject(ModalReactiveService);
  private resizeObserver: ResizeObserver | null = null;

  postList = signal<PostType[]>([]);
  isEditMode = signal<boolean>(false);
  collection = signal<CollectionDetailResDTO | undefined>(undefined);
  selectedPostIds = signal<number[]>([]);
  postCardList = viewChildren<PostCardComponent>('postCard');

  readonly title = computed(() => this.collection()?.title ?? '');
  readonly categoryName = computed(() => this.collection()?.category?.name ?? '');

  // *---------------- 마손리 레이아아웃 변수 --------------------
  // TODO 마소니 레이아웃 간격, 너비 수정
  // TODO 마손리 레이아웃 컴포넌트 or 디렉티브 분리
  // TODO 사진첩 내부 마소니 레이아웃 리펙토링
  private columnWidth = 150;
  private columnGap = 10;
  private rowGap = 10;
  private collectionId: string | undefined = undefined;
  private grid = viewChild.required<ElementRef<HTMLElement>>('grid');
  private items = viewChildren<ElementRef<HTMLElement>>('item');
  // *---------------- 마손리 레이아아웃 변수 // --------------------

  constructor() {
    this.collectionId = this.route.snapshot.paramMap.get('id') as string;
    if (!this.collectionId) return;

    forkJoin({
      collection: this.collectionApi.getCollection(this.collectionId),
      postList: this.postApi.getCollection(this.collectionId),
    }).subscribe(({ collection, postList }) => {
      this.collection.set(collection);
      this.postList.set(postList);
    });

    effect(() => {
      const currentItems = this.items();
      if (currentItems.length > 0) {
        this.initializeLayout();
      }
    });
  }

  onSelect(updatedId: number) {
    const currentIds = this.selectedPostIds();
    const index = currentIds.indexOf(updatedId);

    if (index !== -1) {
      this.selectedPostIds.set(currentIds.filter((id) => id !== updatedId));
    } else {
      this.selectedPostIds.set([...currentIds, updatedId]);
    }
  }

  selectAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (!this.isEditMode()) {
      return;
    }

    this.postCardList().forEach((card) => {
      card.checkboxRef().nativeElement.checked = isChecked;
    });
  }

  postMove() {
    this.bottomSheetService.open(PostMoveComponent as Type<Component>, {
      postIds: this.selectedPostIds(),
      hasSystemFolders: false,
    });
  }

  async postDelete() {
    const modalData = {
      iconName: 'modal-trash',
      subTitle: '선택하신 게시물을 삭제합니다.',
      content: '이 작업은 되돌릴 수 없습니다. 삭제를 원하시지 않을 경우 취소를 눌러주세요.',
      buttons: ['취소', '확인'],
    };

    const result = await this.modalReactiveService.open(modalData);

    if (result !== '확인') {
      return;
    }

    this.postApi.deletePost(this.selectedPostIds()).subscribe((res) => {
      console.log('게시물 삭제 api 전송 후 응답: ', res); //  null값 찍힘
      const modalData = {
        title: '게시물 삭제 완료',
        subTitle: '게시물 삭제가 완료되었습니다.',
        content: '확인버튼을 누르시면 홈 화면으로 돌아갑니다. 확인 버튼을 눌러주세요.',
        buttons: ['확인'],
      };

      const result = this.modalReactiveService.open(modalData);
      if (!result) {
        return;
      }

      this.router.navigateByUrl('home');
    });
  }

  async openBottomSheet() {
    const actionButtons: ActionButtonType[] = [
      {
        type: 'organize',
        icon: 'album',
        text: '사진첩 정리',
        appearance: 'primary',
      },
      {
        type: 'update',
        icon: 'post',
        text: '사진첩 수정',
        appearance: 'secondary',
      },
      {
        type: 'delete',
        icon: 'trash',
        text: '사진첩 삭제',
        appearance: 'danger',
      },
    ];

    const result = await this.bottomSheetService.open(ActionButtonsComponent as Type<Component>, actionButtons);

    switch (result) {
      case 'update':
        return this.router.navigateByUrl(`collection/update/${this.collectionId}`);
      case 'organize':
        return this.isEditMode.set(true);
      case 'delete':
        return this.postDelete();
      default:
        return;
    }
  }

  private async initializeLayout() {
    this.wrapAllItems();
    await this.waitForImagesToLoad(); // 모든 이미지(Promise.all)가 로드될 때까지 대기 (비동기)
    this.positionAllItems(); // Masonry 레이아웃 적용

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.positionAllItems();
    });

    this.resizeObserver.observe(this.grid().nativeElement);
  }

  private positionAllItems() {
    const gridWidth = this.grid().nativeElement.clientWidth;
    const brickWidth = this.columnWidth + this.columnGap;
    const nCol = Math.max(1, Math.floor(gridWidth / brickWidth));

    // container 초기화
    const container = this.grid().nativeElement.querySelector('.container') as HTMLElement;
    container.style.width = brickWidth * nCol - this.columnGap + 'px';

    // 컬럼의 높이 초기화
    const colHeights = Array(nCol).fill(0);

    // 각 아이템 포지셔닝
    this.items().forEach((item) => {
      const brick = item.nativeElement.closest('.brick') as HTMLElement;

      // 각 brick의 실제 높이를 정확하게 측정하기 위해 강제 리플로우
      brick.style.position = 'absolute';
      brick.style.width = `${this.columnWidth}px`;
      brick.style.left = '0';
      brick.style.top = '0';

      // 리플로우 후 실제 brick의 높이 계산
      const brickHeight = brick.offsetHeight + this.rowGap;

      // 가장 작은 크기의 컬럼의 인덱스 구하기
      // 인덱스를 바탕으로 해당 아이템의 위치 계산
      const minColIndex = this.findMinIndex(colHeights);
      const posX = minColIndex * brickWidth;
      const posY = colHeights[minColIndex];

      // 컬럼 높이 배열 업데이트
      colHeights[minColIndex] += brickHeight;

      // Position the brick
      this.setElementStyle(brick, {
        position: 'absolute',
        // width: `${this.columnWidth}px`,
        left: `${posX}px`,
        top: `${posY}px`,
        transition: 'transform 0.3s ease',
      });
    });

    // 컨테이너 높이 설정
    const maxHeight = Math.max(...colHeights);
    container.style.height = maxHeight + 'px';
  }

  private wrapAllItems() {
    // 기존의 컨테이너 있다면 삭제
    const existingContainer = this.grid().nativeElement.querySelector('.container');
    if (existingContainer) {
      existingContainer.remove();
    }

    // 1. container 생성
    const container = document.createElement('div');
    container.classList.add('container');
    this.setElementStyle(container, {
      position: 'relative',
      margin: '0 auto',
    });

    this.items().forEach((item) => {
      // 2. wrapper 생성
      const wrapper = document.createElement('div');
      wrapper.classList.add('wrapper');
      this.setElementStyle(wrapper, {
        padding: `0 ${this.columnGap / 2}px ${this.rowGap}px`,
      });

      const itemElement = item.nativeElement;
      wrapper.appendChild(itemElement);

      // 3. brick 생성
      const brick = document.createElement('div');
      brick.classList.add('brick');
      brick.appendChild(wrapper);

      container.appendChild(brick);
    });

    this.grid().nativeElement.appendChild(container);
  }

  private setElementStyle(element: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
    Object.assign(element.style, styles);
  }

  // 가장 낮은 컬럼의 인덱스 반환 (아이템을 배치할 위치 결정)
  private findMinIndex(arr: number[]): number {
    return arr.indexOf(Math.min(...arr));
  }

  private waitForImagesToLoad(): Promise<void[]> {
    const images = Array.from(this.grid().nativeElement.querySelectorAll('img'));

    return Promise.all(
      images.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) {
              resolve();
            } else {
              img.onload = () => resolve();
              img.onerror = () => resolve();
            }
          }),
      ),
    );
  }

  private ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}
