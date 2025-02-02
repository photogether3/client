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
  public postCreateForm!: FormGroup;

  private readonly fb = inject(FormBuilder);

  get metadataArray(): FormArray<FormGroup> {
    return this.postCreateForm.get('metadataStringify') as FormArray<FormGroup>;
  }

  constructor() {
    this.postCreateForm = this.fb.group({
      // TODO collectionId 실제 사진첩id로 대체
      // TODO file 실제 file로 대체
      collectionId: '1',
      title: '',
      content: '',
      metadataStringify: this.fb.array([]),
      file: 'https://image.aladin.co.kr/product/26681/50/letslook/K092730989_fl.jpg?MW=750&WG=3&WS=100&&WO=30&WF=-15x15&WU=https://image.aladin.co.kr/img/common/openmarket_ci.png',
    });

    this.initializeMetadata();
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
