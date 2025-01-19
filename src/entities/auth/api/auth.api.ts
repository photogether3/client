import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/shared/environments';
import { skipAuth } from 'src/shared/interceptors';
import { jwtSourceDTO, loginDTO, VerifyOtpDTO, RegisterDTO, GenerateOtpDTO } from '../model';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private http = inject(HttpClient);

  // 로그인
  login(loginObj: loginDTO): Observable<jwtSourceDTO> {
    return this.http.post<jwtSourceDTO>(`${environment.serverUrl}/v1/auth/login`, loginObj, {
      context: skipAuth(),
    });
  }

  // 회원가입
  register(registerObj: RegisterDTO) {
    return this.http.post(`${environment.serverUrl}/v1/auth/register`, registerObj, { context: skipAuth() });
  }

  // OTP 발급
  generateOtp(otpObj: GenerateOtpDTO): Observable<jwtSourceDTO> {
    return this.http.post<jwtSourceDTO>(`${environment.serverUrl}/v1/auth/otp/generate`, otpObj, { context: skipAuth() });
  }

  // OTP 검증 및 토큰 발급
  verifyOtp(otpObj: VerifyOtpDTO): Observable<jwtSourceDTO> {
    return this.http.post<jwtSourceDTO>(`${environment.serverUrl}/v1/auth/otp/verify`, otpObj, { context: skipAuth() });
  }

  // 토큰 재발급
  refresh(refreshToken: string): Observable<jwtSourceDTO> {
    let headers = new HttpHeaders();
    headers = headers.append('x-refresh-token', refreshToken);

    return this.http.post<jwtSourceDTO>(
      `${environment.serverUrl}/v1/auth/refresh`,
      {},
      {
        context: skipAuth(),
        headers,
      },
    );
  }

  // 로그아웃
  logout() {
    return this.http.delete(`${environment.serverUrl}/v1/auth/logout`);
  }
}
