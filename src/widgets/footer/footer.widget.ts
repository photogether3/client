import { Component, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

import { IconComponent } from 'src/shared/components';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.widget.html',
  imports: [IconComponent, RouterLink],
})
export class FooterWidget {
  private readonly router = inject(Router);
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
