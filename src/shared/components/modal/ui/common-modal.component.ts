import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../../button';
import { ReactiveModalData } from '../services';

@Component({
  selector: 'app-common-modal',
  templateUrl: 'common-modal.component.html',
  imports: [ButtonComponent],
})
export class CommonModalComponent {
  public data = inject<ReactiveModalData>(DIALOG_DATA);

  private readonly dialogRef = inject(DialogRef);

  constructor() {}

  close(buttonText?: string) {
    this.dialogRef.close(buttonText);
  }
}
