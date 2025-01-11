import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { loginDTO, OtpReqDTO, OtpResDTO, RegisterDTO } from '../model';
import { environment } from 'src/shared/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private http = inject(HttpClient);

  login(loginObj: loginDTO) {
    return this.http.post(`${environment.serverUrl}/api/v1/auth/login`, loginObj);
  }

  register(registerObj: RegisterDTO) {
    return this.http.post(`${environment.serverUrl}/api/v1/auth/register`, registerObj);
  }

  verifyOtp(otpObj: OtpReqDTO): Observable<OtpResDTO> {
    return this.http.post<OtpResDTO>(`${environment.serverUrl}/api/v1/devices`, otpObj);
  }
}
