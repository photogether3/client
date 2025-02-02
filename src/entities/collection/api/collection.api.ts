import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CollectionDTO } from '../model';

@Injectable({
  providedIn: 'root',
})
export class CollectionApi {
  private http = inject(HttpClient);
  public result = [
    {
      id: 1,
      title: '2025 봄옷 쇼핑',
      tag: '패션',
      images: [
        { src: 'https://i.pinimg.com/564x/27/d7/03/27d7039fc6b3e14d55813a1a225d8e5a.jpg', alt: '짱구사진' },
        {
          src: 'https://mblogthumb-phinf.pstatic.net/MjAyNDAzMDZfMjcy/MDAxNzA5Njk1MjkyNDg4.xm34PK1ywuW_kxTr87KasLSB49xRFOIu1ARVLPyJCsAg.2ZqUYCohSogp6l-liqL8akJ7O5Zoxw3RHGckwOJXKU8g.JPEG/SE-6CB03CE3-A132-42CC-AEF9-13D1F94172DD.jpg?type=w800',
          alt: '짱구사진',
        },
        {
          src: 'https://mblogthumb-phinf.pstatic.net/MjAyMTA4MDJfMTM3/MDAxNjI3ODY3Mjg4NzA2.LYzEC3n2-LZ9nekwfwcviDfRQRC91Eec4TO5SmYQuIkg.EtgVKqrz_PmQeiZ-hJCGf9qvFjA__prA-70BuwnqjXQg.JPEG.wenice777/3.jpeg?type=w800',
          alt: '짱구사진',
        },
      ],
    },
    {
      id: 2,
      title: '운동용품-숨쉬기',
      tag: '운동',
      images: [{ src: 'https://i.pinimg.com/564x/27/d7/03/27d7039fc6b3e14d55813a1a225d8e5a.jpg', alt: '짱구사진' }],
    },
    {
      id: 3,
      title: '위시리스트-전자기기',
      tag: '쇼핑',
      images: [
        { src: 'https://i.pinimg.com/564x/27/d7/03/27d7039fc6b3e14d55813a1a225d8e5a.jpg', alt: '짱구사진' },
        {
          src: 'https://mblogthumb-phinf.pstatic.net/MjAyNDAzMDZfMjcy/MDAxNzA5Njk1MjkyNDg4.xm34PK1ywuW_kxTr87KasLSB49xRFOIu1ARVLPyJCsAg.2ZqUYCohSogp6l-liqL8akJ7O5Zoxw3RHGckwOJXKU8g.JPEG/SE-6CB03CE3-A132-42CC-AEF9-13D1F94172DD.jpg?type=w800',
          alt: '짱구사진',
        },
      ],
    },
    {
      id: 4,
      title: '무한도전 짤',
      tag: '유머',
      images: [
        { src: 'https://i.pinimg.com/564x/27/d7/03/27d7039fc6b3e14d55813a1a225d8e5a.jpg', alt: '짱구사진' },
        {
          src: 'https://mblogthumb-phinf.pstatic.net/MjAyNDAzMDZfMjcy/MDAxNzA5Njk1MjkyNDg4.xm34PK1ywuW_kxTr87KasLSB49xRFOIu1ARVLPyJCsAg.2ZqUYCohSogp6l-liqL8akJ7O5Zoxw3RHGckwOJXKU8g.JPEG/SE-6CB03CE3-A132-42CC-AEF9-13D1F94172DD.jpg?type=w800',
          alt: '짱구사진',
        },
        {
          src: 'https://mblogthumb-phinf.pstatic.net/MjAyMTA4MDJfMTM3/MDAxNjI3ODY3Mjg4NzA2.LYzEC3n2-LZ9nekwfwcviDfRQRC91Eec4TO5SmYQuIkg.EtgVKqrz_PmQeiZ-hJCGf9qvFjA__prA-70BuwnqjXQg.JPEG.wenice777/3.jpeg?type=w800',
          alt: '짱구사진',
        },
        { src: 'https://i.pinimg.com/564x/27/d7/03/27d7039fc6b3e14d55813a1a225d8e5a.jpg', alt: '짱구사진' },
      ],
    },
  ];

  // 사진첩 목록 조회
  getCollections(): Observable<CollectionDTO[]> {
    return of(this.result);
  }

  // 사진첩 상세 조회
  getCollection(id: number): Observable<CollectionDTO | undefined> {
    const collection = this.result.find((collection) => collection.id === id);
    return of(collection);
  }
}
