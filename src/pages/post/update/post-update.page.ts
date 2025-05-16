import { Component, inject, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PostService } from 'src/entities/post';
import { ButtonComponent, ModalReactiveService } from 'src/shared/components';
import { StepService } from 'src/shared/services';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';

import { PostFormComponent } from '../ui';

@Component({
  selector: 'post-update-page',
  templateUrl: './post-update.page.html',
  imports: [ButtonComponent, FooterWidget, HeaderWidget, PostFormComponent],
  providers: [StepService],
})
export class PostUpdatePage {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly postService = inject(PostService);
  private readonly modalReactiveService = inject(ModalReactiveService);

  postForm = viewChild.required<PostFormComponent>('postForm');
  postId: string = '';
  previewUrl: string | ArrayBuffer | null | undefined = null;

  constructor() {
    this.postId = this.route.snapshot.paramMap.get('id') as string;
    if (!this.postId) return;
  }

  ngOnInit(): void {
    if (!this.postId) {
      console.log('postId가 없습니다.');
      return;
    }

    this.postService.getPost(this.postId).subscribe((res) => {
      this.postForm().form.patchValue({
        title: res?.title,
        content: res?.content,
      });

      res?.metadataList.forEach((metadata: any) => this.postForm().addMetadata(metadata.content, metadata.isPublic));
      this.postForm().addMetadata();
      this.previewUrl = res?.imageUrl;
    });
  }

  updatePost() {
    const dto = this.postForm().getRawValue();
    const updateDTO = {
      ...dto,
      metadataList: dto.metadataStringify.filter((metadata: any) => metadata.content.trim() !== ''),
    };

    if (!this.postId) return;

    this.postService.updatePost(this.postId, updateDTO).subscribe(() => {
      const modalData = {
        iconName: 'modal-create',
        subTitle: '게시물 수정이 완료되었습니다.',
        content: '확인 버튼을 누르시면 홈 화면으로 돌아갑니다. 확인버튼을 눌러주세요.',
        buttons: ['확인'],
      };
      this.modalReactiveService.open(modalData).then(() => {
        this.router.navigateByUrl('home');
      });
    });
  }
}
