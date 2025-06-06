import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from 'src/shared/environments';

import { jwtSourceDTO, RegisterKakaoDTO } from '../model';

@Injectable({
  providedIn: 'root',
})
export class KakaoAuthApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://photogether.app/kakao';

  getKakaoUrl() {
    return `${this.baseUrl}/login`;
  }

  kakaoRegister(dto: RegisterKakaoDTO): Observable<jwtSourceDTO> {
    return this.http.post<jwtSourceDTO>(`${environment.serverUrl}/v1/social-auth/register`, dto);
  }
}
