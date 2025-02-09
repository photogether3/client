import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostApi } from 'src/entities/post';
import { ButtonComponent, ModalReactiveService } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';

@Component({
  selector: 'post-update-page',
  templateUrl: './post-update.page.html',
  imports: [ButtonComponent, FooterWidget, ReactiveFormsModule, JsonPipe],
})
export class PostUpdatePage {
  public postId: string | undefined = undefined;
  public collectionId: string | undefined = undefined;
  public previewUrl: string | ArrayBuffer | null | undefined = null;
  public postUpdateForm!: FormGroup;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly postApi = inject(PostApi);
  private readonly modalReactiveService = inject(ModalReactiveService);

  get metadataArray(): FormArray<FormGroup> {
    return this.postUpdateForm.get('metadataList') as FormArray<FormGroup>;
  }

  constructor() {
    this.postUpdateForm = this.fb.group({
      title: '',
      content: '',
      metadataList: this.fb.array([]),
    });

    const state = this.router.getCurrentNavigation()?.extras.state;
    this.collectionId = state?.['collectionId'];
    this.postId = state?.['postId'];
  }

  ngOnInit(): void {
    if (this.collectionId && this.postId) {
      this.postApi.getPost(this.collectionId, this.postId).subscribe((res) => {
        this.postUpdateForm.patchValue({
          title: res?.title,
          content: res?.content,
          file: '',
        });

        res?.metadataList.forEach((img) => this.addMetadata(img.content, img.isPublic));
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

  updatePost() {
    const dto = this.postUpdateForm.getRawValue();
    const updateDTO = {
      ...dto,
      metadataList: dto.metadataList.filter((metadata: any) => metadata.content.trim() !== ''),
    };

    this.postApi.updatePost(this.postId as string, updateDTO).subscribe(() => {
      const modalData = {
        title: '게시물 수정 완료',
        subTitle: '게시물 수정이 완료되었습니다.',
        content: '확인 버튼을 누르시면 홈 화면으로 돌아갑니다. 확인버튼을 눌러주세요.',
        buttons: ['확인'],
      };
      this.modalReactiveService.open(modalData).subscribe((buttonText) => {
        console.log('선택된 버튼:', buttonText);
      });
    });
  }
}
