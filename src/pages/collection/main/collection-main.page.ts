import { Component, ElementRef, inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PostApi, PostResDTO } from 'src/entities/post';
import { ButtonComponent, TagComponent } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';

@Component({
  selector: 'app-collection-main',
  templateUrl: './collection-main.page.html',
  imports: [TagComponent, FooterWidget, ButtonComponent, RouterLink],
})
export class CollectionMainPage implements OnInit {
  @ViewChild('grid') grid!: ElementRef<HTMLElement>;
  @ViewChildren('item') items!: QueryList<ElementRef<HTMLDivElement>>;

  public collection: PostResDTO | undefined = undefined;
  public columnWidth = 150;
  public columnGap = 16;
  public rowGap = 16;

  private readonly route = inject(ActivatedRoute);
  private readonly postApi = inject(PostApi);
  private resizeObserver: ResizeObserver | null = null;

  constructor() {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') as string;
    this.postApi.getCollection(id).subscribe((res) => {
      this.collection = res;

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
        width: `${this.columnWidth}px`,
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
}
