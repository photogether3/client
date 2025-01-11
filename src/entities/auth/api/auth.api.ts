import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { OtpDTO, RegisterDTO } from '../model';
import { environment } from 'src/shared/environments';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private http = inject(HttpClient);

  onLogin(loginObj: { email: string; password: string }) {
    return this.http.post(`${environment.serverUrl}/api/v1/auth/login`, loginObj);
  }

  onRegister(registerObj: RegisterDTO) {
    return this.http.post(`${environment.serverUrl}/api/v1/auth/register`, registerObj);
  }

  verifyOtp(otpObj: OtpDTO) {
    return this.http.post(`${environment.serverUrl}/api/v1/devices`, otpObj);
  }
}
