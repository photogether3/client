import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

import { ErrorService } from 'src/shared/services';

import { IconComponent } from '../icon';

@Component({
  selector: 'app-toast',
  templateUrl: 'toast.component.html',
  styles: [
    `
      @keyframes slide-down {
        from {
          transform: translateY(-100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .animate-slide-down {
        animation: slide-down 0.3s ease-out;
      }
    `,
  ],
  imports: [IconComponent, FormsModule, NgClass],
})
export class ToastComponent {
  readonly errorService = inject(ErrorService);

  type = input<'default' | 'success' | 'error'>('error');

  constructor() {}

  close() {
    this.errorService.clear();
  }
}
