import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { inject, Injectable, Type } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BottomSheetService {
  public data?: any;

  private result$?: Subject<any>;
  private overlayRef: OverlayRef | null = null;
  private overlay = inject(Overlay);

  open<T>(component: Type<T>, data?: any) {
    if (this.overlayRef) {
      this.close();
    }

    this.data = data;
    this.result$ = new Subject<any>();

    const overlayConfig = this.overlay.create({
      height: '60vh',
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      panelClass: 'cdk-overlay-panel',
      positionStrategy: this.overlay.position().global().centerHorizontally().bottom('0px'),
    });

    const portal = new ComponentPortal(component);
    overlayConfig.attach(portal);

    this.overlayRef = overlayConfig;
    overlayConfig.backdropClick().subscribe(() => {
      this.close();
    });

    return this.result$.asObservable();
  }

  close(result?: any) {
    if (this.overlayRef) {
      this.result$?.next(result);
      this.result$?.complete();

      this.overlayRef.detach();
      this.overlayRef.dispose();
      this.overlayRef = null;

      this.result$ = undefined;
    }
  }
}
