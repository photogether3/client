import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';

import { ButtonComponent } from '../../button';
import { ReactiveModalData } from '../services';
import { IconComponent } from '../../icon';

@Component({
  selector: 'app-common-modal',
  templateUrl: 'common-modal.component.html',
  imports: [ButtonComponent, IconComponent],
})
export class CommonModalComponent {
  private readonly dialogRef = inject(DialogRef);

  data = inject<ReactiveModalData>(DIALOG_DATA);

  constructor() {}

  close(buttonText?: string) {
    this.dialogRef.close(buttonText);
  }
}
