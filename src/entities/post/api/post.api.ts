import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { environment } from 'src/shared/environments';
import { convertToFormData } from 'src/shared/utils';

import { PostMoveReqDTO, PostReqDto, PostResDTO, PostType, PostUpdateFormType } from '../model';

@Injectable({ providedIn: 'root' })
export class PostApi {
  private readonly http = inject(HttpClient);

  getPosts(collectionId: string): Observable<any | undefined> {
    const params = new HttpParams({
      fromObject: {
        page: 1,
        perPage: 10,
        sortOrder: 'desc',
        sortBy: 'created_at',
        collectionId,
      },
    });

    return this.http.get<PostResDTO>(`${environment.serverUrl}/v1/posts`, { params }).pipe(map((res) => res.items));
  }

  getPost(postId: string): Observable<PostType> {
    return this.http.get<PostType>(`${environment.serverUrl}/v1/posts/${postId}`);
  }

  createPost(postReqDto: PostReqDto) {
    const formData = convertToFormData(postReqDto);
    return this.http.post<PostReqDto>(`${environment.serverUrl}/v1/posts`, formData, {
      headers: {},
    });
  }

  updatePost(postId: string, updatePostDTO: PostUpdateFormType) {
    return this.http.put<PostUpdateFormType>(`${environment.serverUrl}/v1/posts/${postId}`, updatePostDTO);
  }

  deletePost(postIds: number[]) {
    return this.http.delete(`${environment.serverUrl}/v1/posts`, {
      body: { postIds },
    });
  }

  movePost(postMoveReqDto: PostMoveReqDTO) {
    return this.http.patch(`${environment.serverUrl}/v1/posts/move`, postMoveReqDto);
  }
}
