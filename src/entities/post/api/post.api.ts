import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable, tap } from 'rxjs';

import { environment } from 'src/shared/environments';
import { convertToFormData } from 'src/shared/utils';

import { PostMoveReqDTO, PostReqDto, PostResDTO, PostType, PostUpdateFormType } from '../model';

@Injectable({ providedIn: 'root' })
export class PostApi {
  private readonly http = inject(HttpClient);

  // 게시물 목록 조회
  getCollection(collectionId: string): Observable<any | undefined> {
    const params = new HttpParams({
      fromObject: {
        page: 1,
        perPage: 10,
        sortOrder: 'desc',
        sortBy: 'created_at',
        collectionId,
      },
    });

    return this.http.get<PostResDTO>(`${environment.serverUrl}/v1/posts`, { params }).pipe(
      map((res) => res.items),
      tap(console.log),
    );
  }

  // 게시물 조회
  getPost(postId: number): Observable<PostType | undefined> {
    return this.http.get<PostType>(`${environment.serverUrl}/v1/posts/${postId}`);
  }

  // 게시물 생성
  createPost(postReqDto: PostReqDto) {
    const formData = convertToFormData(postReqDto);
    return this.http.post<PostReqDto>(`${environment.serverUrl}/v1/posts`, formData, {
      headers: {},
    });
  }

  // 게시물 수정
  updatePost(postId: number, updatePostDTO: PostUpdateFormType) {
    return this.http.put<PostUpdateFormType>(`${environment.serverUrl}/v1/posts/${postId}`, updatePostDTO);
  }

  // 게시물 삭제
  deletePost(postIds: number[]) {
    return this.http.delete(`${environment.serverUrl}/v1/posts`, {
      body: { postIds },
    });
  }

  // 게시물 이동
  movePost(postMoveReqDto: PostMoveReqDTO) {
    return this.http.patch(`${environment.serverUrl}/v1/posts/move`, postMoveReqDto);
  }
}
