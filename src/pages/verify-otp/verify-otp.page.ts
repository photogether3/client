import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'verify-otp-page',
  templateUrl: './verify-otp.page.html',
  imports: []
})
export class VerifyOtpPage {
  private router = inject(Router);

  constructor() { }
}
