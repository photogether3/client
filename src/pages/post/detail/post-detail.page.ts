import { Component, inject, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PostApi, PostType } from 'src/entities/post';
import { BottomSheetService, ButtonComponent, IconComponent } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';
import { PostActionComponent } from './ui/post-action';
import { HeaderWidget } from 'src/widgets/header';
import { TagComponent } from 'src/entities/category';
import { ActionButtonsComponent } from 'src/pages/collection';

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

  collectionId: string | undefined = undefined;
  post: PostType | undefined = undefined;

  constructor() {
    const postId = this.route.snapshot.paramMap.get('id') as string;
    this.collectionId = this.router.getCurrentNavigation()?.extras.state?.['collectionId'];

    if (this.collectionId) {
      this.postApi.getPost(this.collectionId, Number(postId)).subscribe((res) => {
        this.post = res;
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
    console.log(data);

    const result = await this.bottomSheetService.open(ActionButtonsComponent as Type<Component>, data);
    console.log('📌 바텀시트가 닫히면서 반환된 값:', result);
  }
}
