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
    console.log(data);

    const result = await this.bottomSheetService.open(PostActionComponent as Type<Component>, data);
    console.log('📌 바텀시트가 닫히면서 반환된 값:', result);

    // 게시물 이동
    if (result === 'move') {
      const response = await this.bottomSheetService.open(PostMoveComponent as Type<Component>, this.post?.id);
      if (response === 'success') {
        const modalData = {
          title: '게시물 이동 완료',
          subTitle: '게시물 이동이 완료되었습니다.',
          content: '확인 버튼을 누르시면 홈화면으로 돌아갑니다. 확인버튼을 눌러주세요.',
          buttons: ['확인'],
        };

        this.modalReactiveService.open(modalData).subscribe();
      }
    }
  }
}
