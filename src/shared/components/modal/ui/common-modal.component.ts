import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../../button';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ReactiveModalData } from '../services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-common-modal',
  templateUrl: 'common-modal.component.html',
  imports: [ButtonComponent],
})
export class CommonModalComponent {
  public data = inject<ReactiveModalData>(DIALOG_DATA);

  private router = inject(Router);
  private dialogRef = inject(DialogRef<CommonModalComponent>);

  constructor() {}

  // 닫기
  close() {
    this.dialogRef.close();
  }

  // 확인
  confirm() {
    this.close();
    this.router.navigateByUrl('/home');
  }
}
