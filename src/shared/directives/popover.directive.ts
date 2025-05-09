import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Directive, HostListener, inject, input, model, signal } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

import { filter } from 'rxjs';

import { PopoverComponent, PopoverItemType } from 'src/pages/home';

@Directive({
  selector: '[appPopover]',
})
export class PopoverDirective {
  private readonly overlay = inject(Overlay);
  private readonly router = inject(Router);

  button = input.required<HTMLElement>();
  popoverItems = input.required<PopoverItemType[]>();

  isPopoverOpen = model<boolean>();

  private overlayRef = signal<OverlayRef | null>(null);

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationStart)).subscribe(() => {
      if (this.overlayRef()) {
        this.closePopover();
      }
    });
  }

  @HostListener('click', ['$event'])
  togglePopover(event: MouseEvent) {
    event.stopPropagation();

    if (this.overlayRef()) {
      this.closePopover();
    } else {
      this.openPopover();
    }
  }

  private openPopover() {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.button())
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
          offsetY: 4,
        },
      ]);

    const overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'transparent-backdrop',
      panelClass: 'z-[9999]',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    this.overlayRef.set(overlayRef);

    // 팝오버 닫힘 처리
    this.overlayRef()
      ?.backdropClick()
      .subscribe(() => this.closePopover());

    // PopoverComponent 를 동적으로 붙이기
    const portal = new ComponentPortal(PopoverComponent);
    const cmpRef = this.overlayRef()!.attach(portal);
    cmpRef.instance.items = this.popoverItems();

    this.isPopoverOpen.set(true);
  }

  private closePopover() {
    this.overlayRef()?.dispose();
    this.overlayRef.set(null);
    this.isPopoverOpen.set(false);
  }
}
