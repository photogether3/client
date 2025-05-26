import { computed, inject, Injectable, signal } from '@angular/core';

import { tap } from 'rxjs';

import { CollectionApi } from '../api';
import { CollectionReqDTO, CollectionType } from '../model';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private readonly collectionApi = inject(CollectionApi);

  private _collections = signal<CollectionType[]>([]);

  collections = computed(() => ({
    default: this._collections()?.filter((collection) => collection.type === 'DEFAULT'),
    unCategorized: this._collections()?.find((collection) => collection.type === 'UNCATEGORIZED'),
    trash: this._collections()?.find((collection) => collection.type === 'TRASH'),
  }));

  constructor() {}

  getCollections(keyword?: string, categoryId?: number[]) {
    return this.collectionApi.getCollections(keyword, categoryId).pipe(
      tap((res) => {
        this._collections.set(res);
      }),
    );
  }

  getCollection(collectionId: string) {
    return this.collectionApi.getCollection(collectionId);
  }

  createCollection(reqDTO: CollectionReqDTO) {
    return this.collectionApi.createCollection(reqDTO);
  }

  updateCollection(collectionId: string, reqDTO: CollectionReqDTO) {
    return this.collectionApi.updateCollection(collectionId, reqDTO);
  }

  deleteCollection(collectionId: number) {
    return this.collectionApi.deleteCollection(collectionId);
  }
}
