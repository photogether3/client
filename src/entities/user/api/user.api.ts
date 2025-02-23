import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/shared/environments';
import { skipAuth } from 'src/shared/interceptors';
import { DuplicateEmailDTO, ProfileGetDTO, UpdatePasswordDTO, UpdateProfileDTO } from '../model';

@Injectable({
  providedIn: 'root',
})
export class UserApi {
  private http = inject(HttpClient);

  // 이메일 중복 검증
  checkDuplicatedEmail(email: string) {
    return this.http.get<DuplicateEmailDTO>(`${environment.serverUrl}/v1/users/emails/${email}/duplicated`, {
      context: skipAuth(),
    });
  }

  // 내 프로필 조회
  getProfile(): Observable<ProfileGetDTO> {
    return this.http.get<ProfileGetDTO>(`${environment.serverUrl}/v1/users/me`);
  }

  // 프로필 수정 (온보딩, 프로필 수정 페이지)
  updateProfile(updateProfileDTO: UpdateProfileDTO) {
    return this.http.put(`${environment.serverUrl}/v1/users/me`, updateProfileDTO);
  }

  // 비밀번호 변경 (프로필 페이지)
  updatePassword(updatedPassword: UpdatePasswordDTO): Observable<ProfileGetDTO> {
    return this.http.patch<ProfileGetDTO>(`${environment.serverUrl}/v1/users/me/password`, updatedPassword);
  }
}
