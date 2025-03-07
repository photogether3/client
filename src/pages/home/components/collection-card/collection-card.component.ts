import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TagComponent } from 'src/entities/category';
import { CollectionType } from 'src/entities/collection';

@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  imports: [CommonModule, TagComponent],
})
export class CollectionCardComponent implements OnInit {
  post = input.required<CollectionType>();
  private readonly router = inject(Router);

  constructor() {}

  ngOnInit(): void {
    console.log(this.post());
  }

  goPage() {
    const url = this.router.url;

    if (url.includes('home')) {
      this.router.navigateByUrl('collection/' + this.post().id);
    } else {
      return;
    }
  }
}
