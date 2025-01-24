import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/shared/environments';
import { skipAuth } from 'src/shared/interceptors';
import { ProfileDTO, UpdatePasswordDTO } from '../model';

@Injectable({
  providedIn: 'root',
})
export class UserApi {
  private http = inject(HttpClient);

  // 이메일 중복 검증
  checkDuplicatedEmail(email: string) {
    return this.http.get<{ isDuplicate: boolean }>(`${environment.serverUrl}/v1/users/emails/${email}/duplicated`, {
      context: skipAuth(),
    });
  }

  // 내 프로필 조회
  getProfile(): Observable<ProfileDTO> {
    return this.http.get<ProfileDTO>(`${environment.serverUrl}/v1/users/me`);
  }

  // 비밀번호 변경
  updatePassword(updatedPassword: UpdatePasswordDTO): Observable<ProfileDTO> {
    return this.http.patch<ProfileDTO>(`${environment.serverUrl}/v1/users/password`, updatedPassword);
  }
}
