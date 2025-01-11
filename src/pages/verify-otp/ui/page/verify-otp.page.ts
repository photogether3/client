import { Component, OnInit } from '@angular/core';
import { VerifyOtpFormComponent } from '../form';

@Component({
  selector: 'verify-otp-page',
  templateUrl: './verify-otp.page.html',
  imports: [VerifyOtpFormComponent],
})
export class VerifyOtpPage implements OnInit {
  public email: string = '';

  constructor() {}

  ngOnInit(): void {
    // TODO email 로컬 스토리지에 저장 ?
    this.email = localStorage.getItem('email') || '';
  }
}
