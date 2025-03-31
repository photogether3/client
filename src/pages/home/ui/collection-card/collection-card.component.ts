import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
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

  isCheckable = input<boolean>(false);
  collection = input.required<CollectionType>();
  clickEvent = output<boolean>();
  isOpenPopover = signal<boolean>(false);
  isChecked = signal<boolean>(false);

  constructor() {}

  handlePopover(event: Event) {
    event.stopPropagation();
    this.isOpenPopover.update((prev) => !prev);
  }

  closePopover() {
    this.isOpenPopover.set(false);
  }

  clickCard() {
    if (!this.isCheckable()) {
      this.goPage();
    } else {
      this.isChecked.update((v) => !v);
      this.clickEvent.emit(this.isChecked());
    }
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
