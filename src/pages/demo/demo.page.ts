import { Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-demo',
  templateUrl: 'demo.page.html',
  styleUrl: 'demo.page.css',
  imports: [],
})
export class DemoPage {
  public columnWidth = 170;
  public columnGap = 16;
  public rowGap = 16;

  @ViewChild('grid') grid!: ElementRef<HTMLElement>;
  @ViewChildren('item') items!: QueryList<ElementRef<HTMLDivElement>>;

  constructor() {}

  // ngAfterViewInit과의 차이점 : 모든 리소스(이미지, 폰트 등)가 완전히 로드된 후 발생
  @HostListener('window:load')
  handleLoad() {
    // 1. Item 요소에 Container, Brick, Wrapper 요소로 감싸준다. (item < wrapper < brick < container)
    this.wrapAllItems();

    // 2. Brick의 위치를 계산하여 지정한다.
    this.positionAllItems();
  }

  // TODO 반응형 구현
  @HostListener('window:resize')
  handleResize() {
    console.log('Window resized');
  }

  // Item 요소에 Container, Brick, Wrapper 요소로 감싸준다. (item < wrapper < brick < container)
  wrapAllItems() {
    // 1. container 요소 생성
    const container = document.createElement('div');
    container.classList.add('container');
    const containerConfig = {
      position: 'relative',
    };
    this.setElementStyle(container, containerConfig);

    // 각 item 요소 순회
    this.items.forEach((item) => {
      // 2. wrapper 요소 생성
      const wrapper = document.createElement('div');
      wrapper.classList.add('wrapper');
      const wrapperStyleConfig = {
        'padding-left': this.columnGap / 2 + 'px',
        'padding-right': this.columnGap / 2 + 'px',
        'padding-bottom': this.rowGap + 'px',
      };
      this.setElementStyle(wrapper, wrapperStyleConfig);

      wrapper.appendChild(item.nativeElement);

      // 3. brick 요소 생성
      const brick = document.createElement('div');
      brick.classList.add('brick');
      const brickStyleConfig = {
        position: 'absolute',
        left: '0',
        top: '0',
      };
      this.setElementStyle(brick, brickStyleConfig);
      brick.appendChild(wrapper);

      container.appendChild(brick);
    });

    this.grid.nativeElement.appendChild(container);
  }

  positionAllItems() {
    const gridWidth = this.grid.nativeElement.clientWidth;
    const brickWidth = this.columnWidth + this.columnGap; // 170 +16

    // 1. 컬럼 수 계산
    // 이전에 생성된 컬럼의 수
    let cCol = 0;

    // 생성되어야 하는 컬럼의 수
    const nCol = Math.floor(gridWidth / brickWidth);

    if (cCol === nCol || nCol === 0) return;

    cCol = nCol;

    // 2. 각 컬럼의 위치 추적
    const rowWidths = Array(cCol).fill(0); // 각 컬럼의 x좌표 (컬럼마다 brickWidth만큼 오른쪽으로 이동)
    const colHeights = Array(cCol).fill(0); // 각 컬럼의 y좌표 (아이템이 추가될 때마다 해당 컬럼의 Y 좌표가 증가)

    rowWidths.forEach((_, idx) => {
      rowWidths[idx] = brickWidth * idx;
    });
    console.log(rowWidths); // [0, 186, 372, 558]

    // 3. 각 아이템을 가장 낮은 컬럼에 배치
    this.items.forEach((item) => {
      // item 요소의 가장 가까운 brick 요소를 찾음
      const brick = item.nativeElement.closest('.brick') as HTMLElement;
      // item 요소의 높이를 구하여 rowGap만큼 더해줌
      const brickHeight = item.nativeElement.clientHeight + this.rowGap;
      // 이 item이 현재 row에서 몇 번째 인덱스에 해당하는지 찾음
      const minIndex = this.findMinIndex(colHeights);

      // 찾은 인덱스로 brick의 x, y 좌표를 설정
      const posX = rowWidths[minIndex]; // 해당 컬럼의 x좌표
      const posY = colHeights[minIndex]; // 해당 컬럼의 y좌표

      // y 좌표를 현재 요소의 높이만큼 더해줌
      colHeights[minIndex] += brickHeight;

      const brickStyleConfig = {
        width: `${brickWidth}px`,
        height: `${brickHeight}px`,
        transform: `translateX(${posX}px) translateY(${posY}px)`,
      };
      this.setElementStyle(brick, brickStyleConfig);
    });

    // 4. 컨테이너 높이 설정
    const container = this.grid.nativeElement.querySelector('.container') as HTMLElement;
    const containerWidth = brickWidth * cCol;
    const containerHeight = Math.max(...colHeights); // 컬럼의 최대값
    this.setElementStyle(container, {
      ...container.style,
      width: containerWidth + 'px',
      height: containerHeight + 'px',
    });
  }

  private setElementStyle(element: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
    for (const [key, value] of Object.entries(styles)) {
      if (value !== undefined && value !== null && key in element.style) {
        element.style[key as any] = value.toString();
      }
    }
  }

  // 가장 낮은 컬럼의 인덱스 반환 (아이템을 배치할 위치 결정)
  private findMinIndex(arr: number[]): number {
    return arr.indexOf(Math.min(...arr));
  }
}
