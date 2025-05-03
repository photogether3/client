import { CommonModule } from '@angular/common';
import { Component, inject, input, model } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ImageApi } from 'src/entities/image';
import { ImgContentType, PostCreateFormType } from 'src/entities/post';
import { ButtonComponent, IconComponent, InputComponent, ModalReactiveService } from 'src/shared/components';
import { BaseForm, FormControls } from 'src/shared/lib';
import { StepService } from 'src/shared/services';
import { FooterWidget } from 'src/widgets/footer';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  imports: [ReactiveFormsModule, InputComponent, IconComponent, CommonModule, FooterWidget, ButtonComponent],
  host: {
    class: 'flex min-h-screen flex-1 flex-col border-x bg-layer40',
  },
})
export class PostFormComponent extends BaseForm<PostCreateFormType> {
  private readonly imageApi = inject(ImageApi);
  private readonly modalReactiveService = inject(ModalReactiveService);
  private readonly stepService = inject(StepService);

  previewUrl: string | ArrayBuffer | null | undefined = null;
  formValue = model<PostCreateFormType>();
  isEditMode = input<boolean>(false);

  get metadataArray(): FormArray<FormGroup> {
    return this.form.get('metadataStringify') as FormArray<FormGroup>;
  }

  constructor() {
    super();
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

      lines.forEach((content: string) => this.addMetadata(content, true, false));
      this.addMetadata();
    });
  }

  deleteText(index: number) {
    const modalData = {
      iconName: 'modal-trash',
      subTitle: '선택하신 텍스트를 삭제합니다.',
      content: '이 작업은 되돌릴 수 없습니다. 삭제를 원하시지 않을 경우 취소를 눌러주세요.',
      buttons: ['취소', '확인'],
    };
    this.modalReactiveService.open(modalData).then((res) => {
      if (res !== '확인' || !res) {
        return;
      }
      this.metadataArray.removeAt(index);
    });
  }

  addText(index: number) {
    const newText = this.metadataArray.at(index).get('content')?.value || '';

    if (!newText.trim()) return;
    this.addMetadata();
  }

  addMetadata(content: string = '', isPublic: boolean = true, hasLink: boolean = false) {
    const metadataGroup = this.fb.group({
      content: [content],
      isPublic: [isPublic],
      hasLink: [hasLink],
    });

    this.metadataArray.push(metadataGroup);
  }

  onNext() {
    const raw = this.form.getRawValue();
    const filteredMetadata = this.form.getRawValue().metadataStringify.filter((item) => item.content?.trim() !== '');

    const formValue = {
      ...raw,
      metadataStringify: filteredMetadata,
    };
    this.stepService.setExtraData('form', formValue).nextStep();
  }
}
