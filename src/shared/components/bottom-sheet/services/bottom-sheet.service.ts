import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, inject, Injectable, signal, Type } from '@angular/core';
import { BottomSheetLayout } from '../ui';

@Injectable({
  providedIn: 'root',
})
export class BottomSheetService<T, R> {
  private overlay = inject(Overlay);

  isOpen = signal(false);
  component = signal<Type<Component> | null>(null);
  data = signal<T | undefined>(undefined);

  private overlayRef: OverlayRef | null = null;
  private resultResolver: ((result: R) => void) | null = null;

  open(component: Type<Component>, data?: T): Promise<R> {
    if (this.overlayRef) {
      this.close();
    }

    this.isOpen.set(true);
    this.component.set(component);
    this.data.set(data);

    const overlayConfig = this.overlay.create({
      maxHeight: '60vh',
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      panelClass: 'cdk-overlay-panel',
      positionStrategy: this.overlay.position().global().centerHorizontally().bottom('0px'),
    });

    const portal = new ComponentPortal(BottomSheetLayout);
    overlayConfig.attach(portal);

    this.overlayRef = overlayConfig;
    overlayConfig.backdropClick().subscribe(() => {
      this.close();
    });

    return new Promise<R>((resolve) => {
      this.resultResolver = resolve;
    });
  }

  close(result?: R) {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
      this.overlayRef = null;

      this.isOpen.set(false);
      this.component.set(null);
      this.data.set(undefined);

      if (this.resultResolver) {
        this.resultResolver(result as R);
        this.resultResolver = null;
      }
    }
  }
}
