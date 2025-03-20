import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';

import { TagComponent } from 'src/entities/category';
import { CollectionType } from 'src/entities/collection';
import { IconComponent } from 'src/shared/components';

@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  imports: [CommonModule, TagComponent, IconComponent],
})
export class CollectionCardComponent {
  private readonly router = inject(Router);

  post = input.required<CollectionType>();
  isOpenPopover = signal<boolean>(false);

  constructor() {}

  handlePopover() {
    this.isOpenPopover.update((prev) => !prev);
  }

  goPage() {
    // const url = this.router.url;
    // if (url.includes('home')) {
    //   this.router.navigateByUrl('collection/' + this.post().id);
    // } else {
    //   return;
    // }
  }
}
