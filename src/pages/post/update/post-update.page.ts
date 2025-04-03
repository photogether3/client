import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ImgContentType, PostApi, PostUpdateFormType } from 'src/entities/post';
import { ButtonComponent, IconComponent, InputComponent, ModalReactiveService } from 'src/shared/components';
import { BaseForm, FormControls } from 'src/shared/lib';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';

@Component({
  selector: 'post-update-page',
  templateUrl: './post-update.page.html',
  imports: [ButtonComponent, FooterWidget, ReactiveFormsModule, IconComponent, JsonPipe, HeaderWidget, InputComponent],
})
export class PostUpdatePage extends BaseForm<PostUpdateFormType> {
  // TODO 게시물 수정, 생성 공통 메서드 부모 클래스로 관리
  private readonly router = inject(Router);
  private readonly postApi = inject(PostApi);
  private readonly modalReactiveService = inject(ModalReactiveService);

  postId: number | undefined = undefined;
  collectionId: string | undefined = undefined;
  previewUrl: string | ArrayBuffer | null | undefined = null;

  get metadataArray(): FormArray<FormGroup> {
    return this.form.get('metadataStringify') as FormArray<FormGroup>;
  }

  constructor() {
    super();

    const state = this.router.getCurrentNavigation()?.extras.state;
    this.collectionId = state?.['collectionId'];
    this.postId = state?.['postId'];
  }

  protected override initForm(): void {
    this.form = this.fb.group({
      postId: this.fb.control(this.postId || 0),
      title: this.fb.control(''),
      content: this.fb.control(''),
      metadataStringify: this.fb.array<FormGroup<FormControls<ImgContentType>>>([]),
    });
  }

  ngOnInit(): void {
    if (this.collectionId && this.postId) {
      this.postApi.getPost(this.collectionId, this.postId).subscribe((res) => {
        this.form.patchValue({
          title: res?.title,
          content: res?.content,
        });

        res?.metadataList.forEach((img: any) => this.addMetadata(img.content, img.isPublic));
        this.previewUrl = res?.imageUrl;
        this.addMetadata();
      });
    } else {
      console.log('사진첩 Id 또는 게시물 Id가 이상합니다!');
    }
  }

  addMetadata(content: string = '', isPublic: boolean = false) {
    const metadataGroup = this.fb.group({
      content: [content],
      isPublic: [isPublic],
    });

    this.metadataArray.push(metadataGroup);
  }

  toggleLink(index: number) {
    const control = this.metadataArray.at(index);
    if (control) {
      control.patchValue({
        hasLink: !control.value.hasLink,
      });
    }
  }

  updatePost() {
    const dto = this.getRawValue();
    const updateDTO = {
      ...dto,
      metadataStringify: dto.metadataStringify.filter((metadata: any) => metadata.content.trim() !== ''),
    };

    if (!this.postId) return;

    this.postApi.updatePost(this.postId, updateDTO).subscribe(() => {
      const modalData = {
        title: '게시물 수정 완료',
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
