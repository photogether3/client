import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { environment } from 'src/shared/environments';

import { CollectionDetailResDTO, CollectionReqDTO, CollectionsResDTO } from '../model';

@Injectable({
  providedIn: 'root',
})
export class CollectionApi {
  private readonly http = inject(HttpClient);

  getCollections() {
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

  getCollection(collectionId: string): Observable<CollectionDetailResDTO> {
    return this.http.get<CollectionDetailResDTO>(`${environment.serverUrl}/v1/collections/${collectionId}`);
  }

  createCollection(collectionCreateDTO: CollectionReqDTO) {
    return this.http.post(`${environment.serverUrl}/v1/collections`, collectionCreateDTO);
  }

  updateCollection(collectionId: string, collectionReqDTO: CollectionReqDTO) {
    return this.http.put(`${environment.serverUrl}/v1/collections/${collectionId}`, collectionReqDTO);
  }

  deleteCollection(collectionId: number) {
    return this.http.delete(`${environment.serverUrl}/v1/collections/${collectionId}`);
  }
}
