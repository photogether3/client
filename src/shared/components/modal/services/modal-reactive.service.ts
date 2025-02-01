import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { inject, Injectable } from '@angular/core';
import { CommonModalComponent } from '../ui';

export type ReactiveModalData = {
  title: string;
  subTitle: string;
  content: string;
};

@Injectable({ providedIn: 'root' })
export class ModalReactiveService {
  private readonly dialog = inject(Dialog);
  private dialogRef: DialogRef<CommonModalComponent> | null = null;

  constructor() {}

  open(data: ReactiveModalData) {
    if (this.dialogRef) {
      this.dialogRef.close();
    }

    this.dialogRef = this.dialog.open<CommonModalComponent>(CommonModalComponent, { data });

    this.dialogRef.closed.subscribe(() => {
      this.dialogRef = null;
    });

    return this.dialogRef;
  }
}
