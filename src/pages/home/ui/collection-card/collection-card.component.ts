import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';

import { TagComponent } from 'src/entities/category';
import { CollectionType } from 'src/entities/collection';
import { IconComponent } from 'src/shared/components';
import { ClickOutsideDirective } from 'src/shared/directives';

import { PopoverComponent } from '../popover';

@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  imports: [CommonModule, TagComponent, IconComponent, PopoverComponent, ClickOutsideDirective],
})
export class CollectionCardComponent {
  private readonly router = inject(Router);

  collection = input.required<CollectionType>();
  isOpenPopover = signal<boolean>(false);

  constructor() {}

  handlePopover(event: Event) {
    event.stopPropagation();
    this.isOpenPopover.update((prev) => !prev);
  }

  closePopover() {
    this.isOpenPopover.set(false);
  }

  goPage() {
    if (this.isOpenPopover()) return;

    const url = this.router.url;
    if (url.includes('home')) {
      this.router.navigateByUrl('collection/' + this.collection().id);
    } else {
      return;
    }
  }
}
