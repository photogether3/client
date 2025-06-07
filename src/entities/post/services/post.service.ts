import { computed, inject, Injectable, signal } from '@angular/core';

import { map, tap } from 'rxjs';

import { PostApi } from '../api';
import { PostMoveReqDTO, PostReqDto, PostType, PostUpdateFormType } from '../model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly postApi = inject(PostApi);

  private _postList = signal<PostType[]>([]);

  readonly postList = computed(() => this._postList());

  constructor() {}

  getPosts(collectionId: string) {
    return this.postApi.getPosts(collectionId).pipe(
      tap((res) => {
        this._postList.set(res);
      }),
    );
  }

  getPost(postId: string) {
    return this.postApi.getPost(postId).pipe(
      map((post) => ({
        ...post,
        metadataList: (post?.metadataList ?? []).filter((m) => m.isPublic),
      })),
    );
  }

  createPost(reqDTO: PostReqDto) {
    return this.postApi.createPost(reqDTO);
  }

  updatePost(postId: string, reqDTO: PostUpdateFormType) {
    return this.postApi.updatePost(postId, reqDTO);
  }

  deletePost(postIds: number[]) {
    return this.postApi.deletePost(postIds);
  }

  movePost(reqDTO: PostMoveReqDTO) {
    return this.postApi.movePost(reqDTO);
  }
}
