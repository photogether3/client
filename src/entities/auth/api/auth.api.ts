import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/shared/environments';
import { skipAuth } from 'src/shared/interceptors';
import { jwtSourceDTO, loginDTO, OtpReqDTO, RegisterDTO } from '../model';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private http = inject(HttpClient);

  login(loginObj: loginDTO) {
    return this.http
      .post(`${environment.serverUrl}/api/v1/auth/login`, loginObj, {
        context: skipAuth(),
      })
      .pipe(tap(console.log));
  }

  register(registerObj: RegisterDTO) {
    return this.http.post(`${environment.serverUrl}/api/v1/auth/register`, registerObj, { context: skipAuth() });
  }

  verifyOtp(otpObj: OtpReqDTO): Observable<jwtSourceDTO> {
    return this.http.post<jwtSourceDTO>(`${environment.serverUrl}/api/v1/devices`, otpObj, { context: skipAuth() });
  }

  refresh(refreshToken: string): Observable<jwtSourceDTO> {
    let headers = new HttpHeaders();
    headers = headers.append('x-refresh-token', refreshToken);

    return this.http.post<jwtSourceDTO>(
      `${environment.serverUrl}/api/v1/auth/refresh`,
      {},
      {
        context: skipAuth(),
        headers,
      },
    );
  }
}
