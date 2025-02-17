import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { TagComponent } from 'src/entities/category';
import { CollectionType } from 'src/entities/collection';

@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  imports: [CommonModule, TagComponent],
})
export class CollectionCardComponent {
  public post = input.required<CollectionType>();

  private readonly router = inject(Router);

  constructor() {}

  goPage() {
    const url = this.router.url;

    if (url.includes('home')) {
      this.router.navigateByUrl('collection/' + this.post().collectionId);
    } else {
      return;
    }
  }
}
