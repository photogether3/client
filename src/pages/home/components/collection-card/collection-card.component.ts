import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesDTO } from 'src/entities/category';
import { TagComponent } from 'src/shared/components';

@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  imports: [CommonModule, TagComponent],
})
export class CollectionCardComponent {
  public images = input.required<string[]>();
  public title = input<string>('TITLE');
  public category = input<CategoriesDTO>();
  public collectionId = input<string>();
  public representativeImages = computed(() => this.images().slice(0, 4));

  private router = inject(Router);

  constructor() {}

  goPage() {
    const url = this.router.url;
    if (url.includes('/post/create')) return;

    this.router.navigateByUrl('collection/' + this.collectionId());
  }
}
