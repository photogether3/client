import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'verify-otp-page',
  templateUrl: './verify-otp.page.html',
  imports: [ReactiveFormsModule],
})
export class VerifyOtpPage {
  constructor() {}

  onVerify() {
    console.log('otp 인증!');
  }
}
