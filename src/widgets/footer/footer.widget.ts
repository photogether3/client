import { NgClass } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

import { IconComponent } from 'src/shared/components';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.widget.html',
  imports: [IconComponent, RouterLink, NgClass],
  host: {
    class: 'sticky bottom-0 z-40 pb-[env(safe-area-inset-bottom)] bg-[#1b1d21]/80 shadow-[2px_5px_8px_0_rgba(0,0,0,0.2)] backdrop-blur-[20px]',
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

      console.log(this.url());
    });
  }

  isCurrentUrl(path: string): boolean {
    if (path === 'home') {
      if (this.url().includes('collection') || this.url().includes('post')) {
        return true;
      }
    }
    return this.url().includes(path);
  }
}
