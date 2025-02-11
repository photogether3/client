import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostApi, PostType } from 'src/entities/post';
import { BottomSheetService, ButtonComponent, TagComponent } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';
import { PostActionComponent } from './ui/post-action';

@Component({
  selector: 'post-detail-page',
  templateUrl: './post-detail.page.html',
  imports: [ButtonComponent, FooterWidget, TagComponent],
})
export class PostDetailPage {
  public collectionId: string | undefined = undefined;
  public post: PostType | undefined = undefined;

  private readonly bottomSheetService = inject(BottomSheetService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly postApi = inject(PostApi);

  constructor() {
    const postId = this.route.snapshot.paramMap.get('id') as string;
    this.collectionId = this.router.getCurrentNavigation()?.extras.state?.['collectionId'];

    if (this.collectionId) {
      this.postApi.getPost(this.collectionId, postId).subscribe((res) => {
        this.post = res;
      });
    }
  }

  goPage() {
    this.router.navigateByUrl(`collection/${this.collectionId}`);
  }

  openBottomSheet() {
    const data = {
      collectionId: this.collectionId,
      postId: this.post?.postId,
    };
    this.bottomSheetService.open(PostActionComponent, data).subscribe();
  }
}
