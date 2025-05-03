import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { forkJoin } from 'rxjs';

import { CollectionApi, CollectionType } from 'src/entities/collection';
import { PostApi, PostCreateFormType } from 'src/entities/post';
import { UserApi } from 'src/entities/user';
import { CollectionCardComponent } from 'src/pages/home';
import { ButtonComponent, ModalReactiveService } from 'src/shared/components';
import { StepService } from 'src/shared/services';
import { FooterWidget } from 'src/widgets/footer';
import { SystemFoldersComponent } from 'src/widgets/system-folders/system-folders.component';

@Component({
  selector: 'app-collection-select',
  templateUrl: './collection-select.component.html',
  imports: [CollectionCardComponent, SystemFoldersComponent, FooterWidget, ButtonComponent],
  host: {
    class: 'flex min-h-screen flex-1 flex-col border-x bg-layer40',
  },
})
export class CollectionSelectComponent {
  private readonly router = inject(Router);
  private readonly postApi = inject(PostApi);
  private readonly userApi = inject(UserApi);
  private readonly collectionApi = inject(CollectionApi);
  private readonly stepService = inject(StepService);
  private readonly modalReactiveService = inject(ModalReactiveService);

  nickname: string = '';
  postFormValue = signal<PostCreateFormType | undefined>(undefined);
  selectedCollectionId = signal<number | null>(null);
  collections = signal<CollectionType[]>([]);

  myCollections = computed(() => ({
    default: this.collections()?.filter((collection) => collection.type === 'DEFAULT'),
    uncategorized: this.collections()?.find((collection) => collection.type === 'UNCATEGORIZED'),
    trash: this.collections()?.find((collection) => collection.type === 'TRASH'),
  }));

  constructor() {
    forkJoin({
      collections: this.collectionApi.getCollections(),
      profile: this.userApi.getProfile(),
    }).subscribe(({ collections, profile }) => {
      this.nickname = profile.nickname;

      const formValue = this.stepService.getExtraData('form');
      this.postFormValue.set({
        ...formValue,
        collectionId: collections.find((collection) => collection.type === 'UNCATEGORIZED')?.id ?? 0,
      });

      console.log(this.postFormValue());
    });
  }

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
