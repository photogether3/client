import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { Router } from '@angular/router';

import { PostType } from 'src/entities/post';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  imports: [CommonModule],
})
export class PostCardComponent {
  private readonly router = inject(Router);

  post = input.required<PostType>();
  isCheckable = input<boolean>(false);
  postSelected = output<number>();

  checkboxRef = viewChild.required<ElementRef<HTMLInputElement>>('checkboxRef');

  constructor() {}

  onCheckboxClick(event: Event) {
    event.stopPropagation();
    this.postSelected.emit(this.post().id);
  }

  onContainerClick() {
    if (this.isCheckable()) {
      this.checkboxRef().nativeElement.click();
    } else {
      this.router.navigateByUrl(`post/${this.post().id}`, {
        state: { collectionId: this.post().collection.collectionId },
      });
    }
  }
}
