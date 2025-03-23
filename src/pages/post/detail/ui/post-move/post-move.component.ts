import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import { CollectionApi, CollectionType } from 'src/entities/collection';
import { PostApi, PostMoveReqDTO } from 'src/entities/post';
import { CollectionCardComponent } from 'src/pages/home';
import { BottomSheetService, ButtonComponent } from 'src/shared/components';

@Component({
  selector: 'post-move',
  templateUrl: './post-move.component.html',
  imports: [ButtonComponent, CollectionCardComponent, CommonModule],
})
export class PostMoveComponent {
  private readonly bottomSheetService = inject(BottomSheetService);
  private readonly collectionApi = inject(CollectionApi);
  private readonly postApi = inject(PostApi);

  postIds: number[] = [];
  collections = signal<CollectionType[]>([]);
  myCollections = computed(() => ({
    default: this.collections()?.filter((collection) => collection.type === 'DEFAULT'),
    uncategorized: this.collections()?.find((collection) => collection.type === 'UNCATEGORIZED'),
    trash: this.collections()?.find((collection) => collection.type === 'TRASH'),
  }));
  selectedCollectionId = signal<number | undefined>(this.myCollections().uncategorized?.id);

  constructor() {
    this.postIds = [...this.bottomSheetService.data()];

    this.collectionApi.getCollections().subscribe((res) => {
      this.collections.set(res);
    });
  }

  selectCollection(collectionId: number | undefined, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedCollectionId.set(collectionId);
    }
  }

  movePost() {
    const postMoveDTO = {
      postIds: [...this.postIds],
      collectionId: this.selectedCollectionId(),
    } as PostMoveReqDTO;

    this.postApi.movePost(postMoveDTO).subscribe(() => {
      this.bottomSheetService.close('success');
    });
  }
}
