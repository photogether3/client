import { Component, inject, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TagComponent } from 'src/entities/category';
import { PostApi, PostType } from 'src/entities/post';
import { BottomSheetService, ButtonComponent, IconComponent, ModalReactiveService } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';

import { PostMoveComponent } from './ui';
import { PostActionComponent } from './ui/post-action';

@Component({
  selector: 'post-detail-page',
  templateUrl: './post-detail.page.html',
  imports: [ButtonComponent, FooterWidget, TagComponent, HeaderWidget, IconComponent],
})
export class PostDetailPage {
  private readonly bottomSheetService = inject(BottomSheetService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly postApi = inject(PostApi);
  private readonly modalReactiveService = inject(ModalReactiveService);

  collectionId: string | undefined = undefined;
  post: PostType | undefined = undefined;

  constructor() {
    const postId = this.route.snapshot.paramMap.get('id') as string;
    this.collectionId = this.router.getCurrentNavigation()?.extras.state?.['collectionId'];

    if (this.collectionId) {
      this.postApi.getPost(this.collectionId, Number(postId)).subscribe((res) => {
        this.post = res;
        console.log(this.post);
      });
    }
  }

  goPage() {
    this.router.navigateByUrl(`collection/${this.collectionId}`);
  }

  async openBottomSheet() {
    const data = {
      collectionId: this.collectionId,
      postId: this.post?.id,
    };
    const result = await this.bottomSheetService.open(PostActionComponent as Type<Component>, data);
    // TODO 게시물 수정, 게시물 삭제도 구현
    if (result !== 'move') {
      return;
    }

    this.bottomSheetService.open(PostMoveComponent as Type<Component>, {
      postIds: [this.post?.id],
      hasSystemFolders: true,
    });
  }
}
