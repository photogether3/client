import { Component, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';

import { PostApi } from 'src/entities/post';
import { ButtonComponent, ModalReactiveService } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';

import { PostFormComponent } from '../create';

@Component({
  selector: 'post-update-page',
  templateUrl: './post-update.page.html',
  imports: [ButtonComponent, FooterWidget, HeaderWidget, PostFormComponent],
})
export class PostUpdatePage {
  private readonly router = inject(Router);
  private readonly postApi = inject(PostApi);
  private readonly modalReactiveService = inject(ModalReactiveService);

  postForm = viewChild.required<PostFormComponent>('postForm');
  postId: number = 0;
  previewUrl: string | ArrayBuffer | null | undefined = null;

  constructor() {
    const postId = this.router.url.split('/').at(-1);
    this.postId = Number(postId) || 0;
  }

  ngOnInit(): void {
    if (!this.postId) {
      console.log('postId가 없습니다.');
      return;
    }

    this.postApi.getPost(this.postId).subscribe((res) => {
      this.postForm().form.patchValue({
        title: res?.title,
        content: res?.content,
      });

      res?.metadataList.forEach((metadata: any) => this.postForm().addMetadata(metadata.content, metadata.isPublic));
      this.previewUrl = res?.imageUrl;
    });
  }

  updatePost() {
    const dto = this.postForm().getRawValue();
    const updateDTO = {
      ...dto,
      postId: this.postId,
      metadataStringify: dto.metadataStringify.filter((metadata: any) => metadata.content.trim() !== ''),
    };

    if (!this.postId) return;

    this.postApi.updatePost(this.postId, updateDTO).subscribe(() => {
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
