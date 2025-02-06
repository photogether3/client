import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CollectionApi, CollectionType } from 'src/entities/collection';
import { PostApi } from 'src/entities/post';
import { CollectionCardComponent } from 'src/pages/home';
import { ButtonComponent, ModalReactiveService } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';

@Component({
  selector: 'post-create-page',
  templateUrl: './post-create.page.html',
  imports: [ButtonComponent, FooterWidget, ReactiveFormsModule, JsonPipe, CollectionCardComponent],
})
export class PostCreatePage {
  public step = signal<number>(1);
  public previewUrl: string | ArrayBuffer | null | undefined = null;
  public postCreateForm!: FormGroup;
  public collections: CollectionType[] = [];

  private readonly fb = inject(FormBuilder);
  private readonly postApi = inject(PostApi);
  private readonly collectionApi = inject(CollectionApi);
  private readonly modalReactiveService = inject(ModalReactiveService);

  get metadataArray(): FormArray<FormGroup> {
    return this.postCreateForm.get('metadataStringify') as FormArray<FormGroup>;
  }

  constructor() {
    this.postCreateForm = this.fb.group({
      collectionId: '',
      title: '',
      content: '',
      metadataStringify: this.fb.array([]),
      file: '',
    });

    this.initializeMetadata();

    this.collectionApi.getCollections().subscribe((res) => {
      this.collections = res.items;
    });
  }

  ngOnInit(): void {}

  // 사진 업로드
  upload(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.postCreateForm.patchValue({ file });
      console.log(this.postCreateForm.value);
      const reader = new FileReader();

      reader.onload = (e) => {
        this.previewUrl = e.target?.result;
      };

      reader.readAsDataURL(file);
    }
  }

  initializeMetadata() {
    const initialImages = Array.from({ length: 4 }, (_, i) => ({
      content: `(임시) 사진내용 ${i + 1}`,
      isPublic: false,
    }));

    initialImages.forEach((img) => this.addMetadata(img.content, img.isPublic));
  }

  addMetadata(content: string = '', isPublic: boolean = false) {
    const metadataGroup = this.fb.group({
      content: [content],
      isPublic: [isPublic],
    });

    this.metadataArray.push(metadataGroup);
  }

  updateState() {
    this.step.set(2);
  }

  selectCollection(collectionId: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.postCreateForm.patchValue({ collectionId });
    } else {
      this.postCreateForm.patchValue({ collectionId: '' });
    }
  }

  createCollection() {
    const dto = this.postCreateForm.getRawValue();
    console.log(dto);

    this.postApi.createPost(dto).subscribe((res) => {
      console.log(res);

      // const modalData = {
      //   title: '게시물 생성 완료',
      //   subTitle: '게시물 생성이 완료되었습니다.',
      //   content: '확인 버튼을 누르시면 홈 화면으로 돌아갑니다. 확인버튼을 눌러주세요.',
      // };
      // this.modalReactiveService.open(modalData);
    });
  }
}
