import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { TagComponent } from 'src/shared/components';

@Component({
  selector: 'app-album-card',
  templateUrl: './album-card.component.html',
  imports: [CommonModule, TagComponent],
})
export class AlbumCardComponent {
  public images = input.required<{ alt: string; src: string }[]>();
  public title = input<string>('TITLE');
  public tag = input<string>('TAG');
  public id = input<number>(-999);
  public representativeImages = computed(() => this.images().slice(0, 4));

  private router = inject(Router);

  constructor() {}

  goPage() {
    this.router.navigateByUrl('album/' + this.id().toString());
  }
}
