import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';

@Component({
  selector: 'post-create-page',
  templateUrl: './post-create.page.html',
  imports: [ButtonComponent, FooterWidget, ReactiveFormsModule, JsonPipe],
})
export class PostCreatePage {
  public previewUrl: string | ArrayBuffer | null | undefined = null;
  public postCreateForm!: FormGroup;

  private readonly fb = inject(FormBuilder);

  get metadataArray(): FormArray<FormGroup> {
    return this.postCreateForm.get('metadataStringify') as FormArray<FormGroup>;
  }

  constructor() {
    this.postCreateForm = this.fb.group({
      collectionId: 'Bb7-vVLxfUq8WY28XLh8gdiuIbKbQd',
      title: '',
      content: '',
      metadataStringify: this.fb.array([]),
      file: '',
    });

    this.initializeMetadata();
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
    alert('기능 개발중 ..');
  }
}
