import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
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
  public representativeImages = computed(() => this.images().slice(0, 4));

  constructor() {}
}
