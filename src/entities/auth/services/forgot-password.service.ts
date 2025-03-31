import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ForgotPasswordService {
  private _email = '';
  private _otp = '';

  // TODO (질문) 로컬스토리지 맞는지 ??1
  setEmail(value: string) {
    this._email = value;
    sessionStorage.setItem('findPasswordEmail', value);
  }

  getEmail(): string {
    if (!this._email) {
      this._email = sessionStorage.getItem('findPasswordEmail') ?? '';
    }
    return this._email;
  }

  setOtp(value: string) {
    this._otp = value;
    sessionStorage.setItem('findPasswordOtp', value);
  }

  getOtp(): string {
    if (!this._otp) {
      this._otp = sessionStorage.getItem('findPasswordOtp') ?? '';
    }
    return this._otp;
  }

  clear() {
    this._email = '';
    this._otp = '';
    sessionStorage.removeItem('findPasswordEmail');
    sessionStorage.removeItem('findPasswordOtp');
  }
}
