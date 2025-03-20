import { Directive, ElementRef, HostListener, inject, input, output, Signal } from '@angular/core';

@Directive({
  selector: '[clickOutside]',
})
export class ClickOutsideDirective {
  private readonly elementRef = inject(ElementRef);

  ignoreEl = input<HTMLElement | undefined>(undefined);
  clickOutside = output<void>();

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target as Node);
    const clickedIgnoredEl = this.ignoreEl()?.contains(event.target as Node);

    if (!clickedInside && !clickedIgnoredEl) {
      this.clickOutside.emit();
    }
  }
}
