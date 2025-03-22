import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/shared/environments';

@Injectable({
  providedIn: 'root',
})
export class VisionApi {
  private http = inject(HttpClient);

  // 이미지 정보 추출
  preview(imageFile: File) {
    const formData = new FormData();
    formData.append('file', imageFile);

    return this.http.post<{ text: string }>(`${environment.serverUrl}/v1/vision/preview`, formData);
  }
}
