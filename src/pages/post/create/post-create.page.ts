import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CollectionApi, CollectionType } from 'src/entities/collection';
import { ImageApi } from 'src/entities/image';
import { ImgContentType, PostApi, PostCreateFormType } from 'src/entities/post';
import { UserApi } from 'src/entities/user';
import { CollectionCardComponent } from 'src/pages/home';
import { ButtonComponent, IconComponent, InputComponent, ModalReactiveService } from 'src/shared/components';
import { BaseForm, FormControls } from 'src/shared/lib';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';
import { SystemFoldersComponent } from 'src/widgets/system-folders/system-folders.component';

@Component({
  selector: 'post-create-page',
  templateUrl: './post-create.page.html',
  imports: [ButtonComponent, FooterWidget, ReactiveFormsModule, CollectionCardComponent, HeaderWidget, InputComponent, IconComponent, CommonModule, SystemFoldersComponent],
})
export class PostCreatePage extends BaseForm<PostCreateFormType> {
  private readonly router = inject(Router);
  private readonly postApi = inject(PostApi);
  private readonly imageApi = inject(ImageApi);
  private readonly userApi = inject(UserApi);
  private readonly collectionApi = inject(CollectionApi);
  private readonly modalReactiveService = inject(ModalReactiveService);

  nickname: string = '';
  step = signal<number>(1);
  collections = signal<CollectionType[]>([]);
  selectedCollectionId = signal<number | null>(null);
  previewUrl: string | ArrayBuffer | null | undefined = null;
  myCollections = computed(() => ({
    default: this.collections()?.filter((collection) => collection.type === 'DEFAULT'),
    uncategorized: this.collections()?.find((collection) => collection.type === 'UNCATEGORIZED'),
    trash: this.collections()?.find((collection) => collection.type === 'TRASH'),
  }));

  get metadataArray(): FormArray<FormGroup> {
    return this.form.get('metadataStringify') as FormArray<FormGroup>;
  }

  get getButtonText() {
    if (this.step() === 1) {
      return '다음으로';
    } else if (this.step() === 2) {
      return '게시물 생성하기';
    }
    return '';
  }

  constructor() {
    super();

    this.collectionApi.getCollections().subscribe((res) => {
      this.collections.set(res);
      this.form.patchValue({
        collectionId: this.myCollections().uncategorized?.id,
      });
    });

    this.userApi.getProfile().subscribe((res) => {
      this.nickname = res.nickname;
    });
  }

  protected override initForm(): void {
    this.form = this.fb.group({
      collectionId: this.fb.control(0),
      title: this.fb.control(''),
      content: this.fb.control(''),
      metadataStringify: this.fb.array<FormGroup<FormControls<ImgContentType>>>([]),
      file: this.fb.control<File | null>(null),
    });
  }

  clickFooterButton() {
    if (this.step() === 1) {
      this.step.set(2);
    } else if (this.step() === 2) {
      return this.createCollection();
    }
  }

  // =============== STEP1 ===============
  upload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.form.patchValue({ file });

    const reader = new FileReader();
    reader.onload = ({ target }) => {
      this.previewUrl = target?.result;
    };

    reader.readAsDataURL(file);

    this.imageApi.extractImgText({ file }).subscribe((textArray) => {
      const { lines } = textArray;
      lines.forEach((content: string) => {
        this.addMetadata(content, false, false);
      });
    });
  }

  deleteText(index: number) {
    // TODO 게시글 사진 내용 삭제
    const control = this.metadataArray.at(index);
    console.log(control.value);
  }

  private addMetadata(content: string = '', isPublic: boolean = false, hasLink: boolean = false) {
    const metadataGroup = this.fb.group({
      content: [content],
      isPublic: [isPublic],
      hasLink: [hasLink],
    });

    this.metadataArray.push(metadataGroup);
  }

  // =============== STEP2 ===============
  onCardChecked(collectionId?: number) {
    if (!collectionId) {
      return;
    }

    const isSame = this.selectedCollectionId() === collectionId;
    this.selectedCollectionId.set(isSame ? null : collectionId);

    this.form.patchValue({ collectionId: isSame ? null : collectionId });
    console.log(this.form.value);
  }

  createCollection() {
    const dto = this.getRawValue();

    this.postApi.createPost(dto).subscribe({
      next: () => {
        const modalData = {
          iconName: 'modal-photo',
          subTitle: '게시물 생성이 완료되었습니다.',
          content: '확인 버튼을 누르시면 홈 화면으로 돌아갑니다. 확인버튼을 눌러주세요.',
          buttons: ['확인'],
        };
        this.modalReactiveService.open(modalData).then(() => {
          this.router.navigateByUrl('/home');
        });
      },
    });
  }
}
