import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { forkJoin } from 'rxjs';

import { CollectionApi, CollectionType } from 'src/entities/collection';
import { PostApi, PostCreateFormType } from 'src/entities/post';
import { UserApi } from 'src/entities/user';
import { CollectionCardComponent } from 'src/pages/home';
import { ButtonComponent, ModalReactiveService } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';
import { SystemFoldersComponent } from 'src/widgets/system-folders/system-folders.component';

import { PostFormComponent } from './ui';

@Component({
  selector: 'post-create-page',
  templateUrl: './post-create.page.html',
  imports: [ButtonComponent, FooterWidget, CollectionCardComponent, HeaderWidget, CommonModule, SystemFoldersComponent, PostFormComponent],
})
export class PostCreatePage {
  private readonly router = inject(Router);
  private readonly postApi = inject(PostApi);
  private readonly userApi = inject(UserApi);
  private readonly collectionApi = inject(CollectionApi);
  private readonly modalReactiveService = inject(ModalReactiveService);

  nickname: string = '';
  postFormValue = signal<PostCreateFormType | undefined>(undefined);
  step = signal<number>(1);
  collections = signal<CollectionType[]>([]);
  selectedCollectionId = signal<number | null>(null);
  myCollections = computed(() => ({
    default: this.collections()?.filter((collection) => collection.type === 'DEFAULT'),
    uncategorized: this.collections()?.find((collection) => collection.type === 'UNCATEGORIZED'),
    trash: this.collections()?.find((collection) => collection.type === 'TRASH'),
  }));

  get getButtonText() {
    if (this.step() === 1) {
      return '다음으로';
    } else if (this.step() === 2) {
      return '게시물 생성하기';
    }
    return '';
  }

  constructor() {
    effect(() => {
      if (this.step() === 2 && this.postFormValue()) {
        this.postFormValue.update((prev) => ({
          ...prev!,
          collectionId: this.myCollections().uncategorized?.id ?? 0,
        }));
      }
    });

    forkJoin({
      collections: this.collectionApi.getCollections(),
      profile: this.userApi.getProfile(),
    }).subscribe(({ collections, profile }) => {
      this.collections.set(collections);
      this.nickname = profile.nickname;
    });
  }

  clickFooterButton() {
    if (this.step() === 1) {
      this.step.set(2);
    } else if (this.step() === 2) {
      return this.createPost();
    }
  }

  // =============== STEP2 ===============
  onCardChecked(collectionId?: number) {
    if (!collectionId) {
      return;
    }

    const isSame = this.selectedCollectionId() === collectionId;
    this.selectedCollectionId.set(isSame ? null : collectionId);

    this.postFormValue.update((prev) => ({
      ...prev!,
      collectionId: isSame ? 0 : collectionId,
    }));
  }

  createPost() {
    const dto = this.postFormValue();

    if (!dto) {
      console.log('없어요');
      return;
    }

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
