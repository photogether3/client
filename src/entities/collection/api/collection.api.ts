import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CollectionDetailResDTO, CollectionReqDTO, CollectionsResDTO } from '../model';
import { environment } from 'src/shared/environments';

@Injectable({
  providedIn: 'root',
})
export class CollectionApi {
  private http = inject(HttpClient);

  // 사진첩 목록 조회
  getCollections(): Observable<CollectionsResDTO> {
    const params = new HttpParams({
      fromObject: {
        page: 1,
        perPage: 10,
        sortOrder: 'desc',
        sortBy: 'title',
      },
    });

    return this.http.get<CollectionsResDTO>(`${environment.serverUrl}/v1/collections`, { params });
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
