import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CollectionApi, CollectionType } from 'src/entities/collection';
import { CollectionCardComponent } from 'src/pages/home';
import { BottomSheetService, ButtonComponent, ModalReactiveService } from 'src/shared/components';

@Component({
  selector: 'post-move',
  templateUrl: './post-move.component.html',
  imports: [ButtonComponent, CollectionCardComponent],
})
export class PostMoveComponent {
  public postId!: string;
  public selectedCollectionId: string | undefined = undefined;
  public collections: CollectionType[] = [];

  private readonly modalReactiveService = inject(ModalReactiveService);
  private readonly bottomSheetService = inject(BottomSheetService);
  private readonly collectionApi = inject(CollectionApi);
  private readonly router = inject(Router);

  constructor() {
    this.postId = this.bottomSheetService.data;

    this.collectionApi.getCollections().subscribe((res) => {
      this.collections = res.items;
    });
  }

  selectCollection(collectionId: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedCollectionId = collectionId;
    }
  }

  movePost() {
    console.log(this.selectedCollectionId);
  }
}
