import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/shared/environments';
import { PostReqDto } from '../model';

@Injectable({ providedIn: 'root' })
export class PostApi {
  private readonly http = inject(HttpClient);

  // 게시물 생성
  createPost(postReqDto: PostReqDto) {
    const formData = this.convertToFormData(postReqDto);
    return this.http.post<PostReqDto>(`${environment.serverUrl}/v1`, formData, {
      headers: {},
    });
  }

  private convertToFormData(postReqDto: PostReqDto): FormData {
    const formData = new FormData();
    console.log(formData);

    Object.keys(postReqDto).forEach((key) => {
      const value = (postReqDto as any)[key];
      console.log(key, value);

      if (value instanceof File) {
        formData.append(key, value); // ✅ 파일이면 그대로 추가
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value)); // ✅ 배열 데이터를 JSON 문자열로 변환하여 추가
      } else {
        formData.append(key, value); // ✅ 일반 텍스트 값 추가
      }
    });

    console.log('📌 FormData 출력:');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
    return formData;
  }
}
