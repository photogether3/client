import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styles: `
    :host {
      position: absolute;
      top: 100%;
      left: 50%;
      z-index: 10;
      transform: translateX(-50%);
      margin-top: 0.5rem;
    }
  `,
  imports: [CommonModule],
})
export class PopoverComponent {
  private readonly router = inject(Router);

  collectionId = input.required<number>();

  constructor() {}

  onClick(type: 'update' | 'organize' | 'delete') {
    if (type === 'update') {
      this.router.navigateByUrl(`collection/update/${this.collectionId()}`);
    }
    console.log(type);
  }
}
