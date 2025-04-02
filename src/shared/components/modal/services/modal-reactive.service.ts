import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { inject, Injectable } from '@angular/core';

import { firstValueFrom, Observable } from 'rxjs';

import { CommonModalComponent } from '../ui';

export type ReactiveModalData = {
  iconName?: string;
  title?: string;
  subTitle: string;
  content: string;
  buttons: string[];
};

@Injectable({ providedIn: 'root' })
export class ModalReactiveService {
  private readonly dialog = inject(Dialog);
  private dialogRef: DialogRef<CommonModalComponent> | null = null;

  constructor() {}

  open(data: ReactiveModalData): Promise<string | undefined> {
    if (this.dialogRef) {
      this.dialogRef.close();
    }

    this.dialogRef = this.dialog.open<CommonModalComponent>(CommonModalComponent, { data });
    return firstValueFrom(this.dialogRef.closed as Observable<string | undefined>);
  }
}
