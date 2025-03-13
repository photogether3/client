import { Component, effect, ElementRef, inject, OnInit, QueryList, signal, Type, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TagComponent } from 'src/entities/category';
import { CollectionApi, CollectionDetailResDTO } from 'src/entities/collection';
import { PostApi, PostType } from 'src/entities/post';
import { BottomSheetService, ButtonComponent, IconComponent, ModalReactiveService, SearchBarComponent } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';

import { ActionButtonsComponent, PostCardComponent } from '../ui';
import { PostMoveComponent } from 'src/pages/post';

@Component({
  selector: 'app-collection-main',
  templateUrl: './collection-main.page.html',
  imports: [TagComponent, FooterWidget, HeaderWidget, IconComponent, SearchBarComponent, PostCardComponent, ButtonComponent],
})
export class CollectionMainPage implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly collectionApi = inject(CollectionApi);
  private readonly postApi = inject(PostApi);
  private readonly bottomSheetService = inject(BottomSheetService);
  private readonly modalReactiveService = inject(ModalReactiveService);
  private resizeObserver: ResizeObserver | null = null;

  @ViewChild('grid') grid!: ElementRef<HTMLElement>;
  @ViewChildren('item') items!: QueryList<ElementRef<HTMLElement>>;

  collection: CollectionDetailResDTO | undefined = undefined;
  postList: PostType[] | undefined = undefined;
  // TODO 마소니 레이아웃 간격, 너비 수정
  columnWidth = 150;
  columnGap = 10;
  rowGap = 10;
  collectionId: string | undefined = undefined;

  isEditMode = signal<boolean>(false);
  selectedPostIds = signal<number[]>([]);

  constructor() {
    effect(() => {
      console.log(this.selectedPostIds());
    });
  }

  // TODO 사진첩 내부 마소니 레이아웃 리펙토링
  ngOnInit(): void {
    this.collectionId = this.route.snapshot.paramMap.get('id') as string;
    if (!this.collectionId) return;

    this.collectionApi.getCollection(this.collectionId).subscribe((res) => {
      this.collection = res;
    });

    this.postApi.getCollection(this.collectionId).subscribe((res) => {
      this.postList = res;

      this.items.changes.subscribe(() => {
        if (this.items.length > 0) {
          this.initializeLayout();
        }
      });
    });
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

    this.resizeObserver.observe(this.grid.nativeElement);
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

  positionAllItems() {
    const gridWidth = this.grid.nativeElement.clientWidth;
    const brickWidth = this.columnWidth + this.columnGap;
    const nCol = Math.max(1, Math.floor(gridWidth / brickWidth));

    // container 초기화
    const container = this.grid.nativeElement.querySelector('.container') as HTMLElement;
    container.style.width = brickWidth * nCol - this.columnGap + 'px';

    // 컬럼의 높이 초기화
    const colHeights = Array(nCol).fill(0);

    // 각 아이템 포지셔닝
    this.items.forEach((item) => {
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

  wrapAllItems() {
    // 기존의 컨테이너 있다면 삭제
    const existingContainer = this.grid.nativeElement.querySelector('.container');
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

    this.items.forEach((item) => {
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

    this.grid.nativeElement.appendChild(container);
  }

  private setElementStyle(element: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
    Object.assign(element.style, styles);
  }

  // 가장 낮은 컬럼의 인덱스 반환 (아이템을 배치할 위치 결정)
  private findMinIndex(arr: number[]): number {
    return arr.indexOf(Math.min(...arr));
  }

  private waitForImagesToLoad(): Promise<void[]> {
    const images = Array.from(this.grid.nativeElement.querySelectorAll('img'));

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

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  // 게시물 이동
  async postMove() {
    const response = await this.bottomSheetService.open(PostMoveComponent as Type<Component>, this.selectedPostIds());
    if (response === 'success') {
      const modalData = {
        title: '게시물 이동 완료',
        subTitle: '게시물 이동이 완료되었습니다.',
        content: '확인 버튼을 누르시면 홈화면으로 돌아갑니다. 확인버튼을 눌러주세요.',
        buttons: ['확인'],
      };

      this.modalReactiveService.open(modalData).subscribe();
    }
  }

  postDelete() {
    const modalData = {
      title: '게시물 삭제',
      subTitle: '선택하신 게시물을 삭제합니다.',
      content: '삭제 버튼을 누르시면 해당 게시물이 삭제됩니다. 이 작업은 되돌릴 수 없습니다. 삭제를 원하시지 않을 경우 취소를 눌러주세요.',
      buttons: ['취소', '확인'],
    };
    this.modalReactiveService.open(modalData).subscribe((res) => {
      if (res === '확인') {
        this.postApi.deletePost(this.selectedPostIds()).subscribe((res) => {
          console.log('게시물 삭제 api 전송 후 응답: ', res); //  null값 찍힘
          const modalData = {
            title: '게시물 삭제 완료',
            subTitle: '게시물 삭제가 완료되었습니다.',
            content: '확인버튼을 누르시면 홈 화면으로 돌아갑니다. 확인 버튼을 눌러주세요.',
            buttons: ['확인'],
          };

          this.modalReactiveService.open(modalData).subscribe((res) => {
            this.router.navigateByUrl('home');
          });
        });
      }
    });
  }

  async openBottomSheet() {
    const result = await this.bottomSheetService.open(ActionButtonsComponent as Type<Component>);
    console.log('📌 바텀시트가 닫히면서 반환된 값:', result);

    if (result === 'update') {
      this.router.navigateByUrl(`collection/update/${this.collectionId}`);
    } else if (result === 'organize') {
      this.isEditMode.set(true);
    }
  }
}
