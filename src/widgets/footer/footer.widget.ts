import { NgClass } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

import { IconComponent } from 'src/shared/components';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.widget.html',
  imports: [IconComponent, RouterLink, NgClass],
  host: {
    class: 'sticky bottom-0 z-40 pb-[env(safe-area-inset-bottom)]',
  },
})
export class FooterWidget {
  private readonly router = inject(Router);

  hasButton = input<boolean>(false);
  private readonly url = signal<string>(this.router.url);

  constructor() {
    effect(() => {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.url.set(event.url);
        }
      });
    });
  }

  isCurrentUrl(path: string): boolean {
    return this.url().includes(path);
  }
}
