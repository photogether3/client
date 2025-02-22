import { Component, inject } from '@angular/core';
import { CollectionApi, CollectionType } from 'src/entities/collection';
import { PostApi, PostMoveReqDTO } from 'src/entities/post';
import { CollectionCardComponent } from 'src/pages/home';
import { BottomSheetService, ButtonComponent } from 'src/shared/components';

@Component({
  selector: 'post-move',
  templateUrl: './post-move.component.html',
  imports: [ButtonComponent, CollectionCardComponent],
})
export class PostMoveComponent {
  public postId!: number;
  public selectedCollectionId?: number;
  public collections: CollectionType[] = [];

  private readonly bottomSheetService = inject(BottomSheetService);
  private readonly collectionApi = inject(CollectionApi);
  private readonly postApi = inject(PostApi);

  constructor() {
    this.postId = this.bottomSheetService.data;

    this.collectionApi.getCollections().subscribe((res) => {
      this.collections = res.items;
    });
  }

  selectCollection(collectionId: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedCollectionId = collectionId;
    }
  }

  movePost() {
    const postMoveDTO = {
      postIds: [this.postId],
      collectionId: this.selectedCollectionId,
    } as PostMoveReqDTO;

    console.log(postMoveDTO);
    this.postApi.movePost(postMoveDTO).subscribe(() => {
      this.bottomSheetService.close('success');
    });
  }
}
