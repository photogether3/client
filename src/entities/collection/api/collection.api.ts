import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable, of, tap } from 'rxjs';

import { environment } from 'src/shared/environments';

import { CollectionDetailResDTO, CollectionReqDTO, CollectionsResDTO, CollectionTypeEnum } from '../model';

@Injectable({
  providedIn: 'root',
})
export class CollectionApi {
  private http = inject(HttpClient);

  private readonly mockCollections = [
    {
      id: '2',
      title: '휴지통',
      type: CollectionTypeEnum.TRASH,
      category: null,
      postCount: 0,
      createdAt: new Date('2025-02-22T11:42:50.000+00:00'),
      updatedAt: new Date('2025-02-22T11:42:50.000+00:00'),
      imageUrls: [],
    },
    {
      id: '4',
      title: '여행을 가보자',
      type: CollectionTypeEnum.DEFAULT,
      category: { id: 1003, name: '여행' },
      postCount: 0,
      createdAt: new Date('2025-02-22T11:42:50.000+00:00'),
      updatedAt: new Date('2025-02-22T11:42:50.000+00:00'),
      imageUrls: [],
    },
    {
      id: '1',
      title: '미분류',
      type: CollectionTypeEnum.UNCATEGORIZED,
      category: null,
      postCount: 0,
      createdAt: new Date('2025-02-22T11:42:50.000+00:00'),
      updatedAt: new Date('2025-02-22T11:42:50.000+00:00'),
      imageUrls: [],
    },
    {
      id: '3',
      title: '건강 챙기기',
      type: CollectionTypeEnum.DEFAULT,
      category: { id: 1002, name: '건강 & 웰니스' },
      postCount: 20,
      createdAt: new Date('2025-02-22T11:42:50.000+00:00'),
      updatedAt: new Date('2025-02-22T11:42:50.000+00:00'),
      imageUrls: ['https://picsum.photos/seed/YrCrkD/25/1418', 'https://loremflickr.com/3878/2417?lock=779090'],
    },
  ];

  // 사진첩 목록 조회
  getCollections(): Observable<any> {
    if (!environment.production) {
      return of(this.mockCollections);
    }

    const params = new HttpParams({
      fromObject: {
        page: 1,
        perPage: 10,
        sortOrder: 'desc',
        sortBy: 'title',
      },
    });
    return this.http.get<CollectionsResDTO>(`${environment.serverUrl}/v1/collections`, { params }).pipe(map((res) => res.items));
  }

  // 사진첩 상세 조회
  getCollection(collectionId: string): Observable<CollectionDetailResDTO> {
    return this.http.get<CollectionDetailResDTO>(`${environment.serverUrl}/v1/collections/${collectionId}`);
  }

  // 사진첩 생성
  createCollection(collectionCreateDTO: CollectionReqDTO) {
    return this.http.post(`${environment.serverUrl}/v1/collections`, collectionCreateDTO);
  }

  // 사진첩 수정
  updateCollection(collectionId: string, collectionReqDTO: CollectionReqDTO) {
    return this.http.put(`${environment.serverUrl}/v1/collections/${collectionId}`, collectionReqDTO);
  }
}
