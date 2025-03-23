import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { CollectionApi, CollectionType } from 'src/entities/collection';
import { ImageApi } from 'src/entities/image';
import { ImgContentType, PostApi, PostCreateFormType } from 'src/entities/post';
import { CollectionCardComponent } from 'src/pages/home';
import { ButtonComponent, IconComponent, InputComponent, ModalReactiveService } from 'src/shared/components';
import { BaseForm, FormControls } from 'src/shared/lib';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';

@Component({
  selector: 'post-create-page',
  templateUrl: './post-create.page.html',
  imports: [ButtonComponent, FooterWidget, ReactiveFormsModule, CollectionCardComponent, HeaderWidget, InputComponent, IconComponent, CommonModule],
})
export class PostCreatePage extends BaseForm<PostCreateFormType> {
  private readonly postApi = inject(PostApi);
  private readonly imageApi = inject(ImageApi);
  private readonly collectionApi = inject(CollectionApi);
  private readonly modalReactiveService = inject(ModalReactiveService);

  step = signal<number>(1);
  collections = signal<CollectionType[]>([]);
  previewUrl: string | ArrayBuffer | null | undefined = null;
  myCollections = computed(() => ({
    default: this.collections()?.filter((collection) => collection.type === 'DEFAULT'),
    uncategorized: this.collections()?.find((collection) => collection.type === 'UNCATEGORIZED'),
    trash: this.collections()?.find((collection) => collection.type === 'TRASH'),
  }));

  get metadataArray(): FormArray<FormGroup> {
    return this.form.get('metadataStringify') as FormArray<FormGroup>;
  }

  constructor() {
    super();

    this.collectionApi.getCollections().subscribe((res) => {
      this.collections.set(res);
      this.form.patchValue({
        collectionId: this.myCollections().uncategorized?.id,
      });
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

  toggleLink(index: number) {
    const control = this.metadataArray.at(index);
    if (control) {
      control.patchValue({
        hasLink: !control.value.hasLink,
      });
    }
  }

  updateState() {
    console.log(this.form.value);
    this.step.set(2);
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
  selectCollection(collectionId: number | undefined, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.form.patchValue({ collectionId });
    } else {
      this.form.patchValue({ collectionId: null });
    }
  }

  createCollection() {
    const dto = this.getRawValue();
    console.log(dto);

    this.postApi.createPost(dto).subscribe(() => {
      const modalData = {
        title: '게시물 생성 완료',
        subTitle: '게시물 생성이 완료되었습니다.',
        content: '확인 버튼을 누르시면 홈 화면으로 돌아갑니다. 확인버튼을 눌러주세요.',
        buttons: ['확인'],
      };
      this.modalReactiveService.open(modalData).subscribe((buttonText) => {
        console.log('선택된 버튼:', buttonText);
      });
    });
  }
}
