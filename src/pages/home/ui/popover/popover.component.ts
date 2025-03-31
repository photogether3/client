import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { IconComponent } from 'src/shared/components';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  imports: [CommonModule, IconComponent],
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
