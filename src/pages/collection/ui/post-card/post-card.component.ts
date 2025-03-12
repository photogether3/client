import { CommonModule } from '@angular/common';
import { Component, ElementRef, input, output, viewChild } from '@angular/core';

import { PostType } from 'src/entities/post';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  imports: [CommonModule],
})
export class PostCardComponent {
  post = input.required<PostType>();
  isCheckable = input<boolean>(false);

  selectedPostId = input<number | undefined>();
  postSelected = output<number | undefined>();

  checkboxRef = viewChild.required<ElementRef<HTMLInputElement>>('checkboxRef');

  constructor() {}

  onCheckboxClick(event: Event) {
    event.stopPropagation();

    if (this.selectedPostId() === this.post().id) {
      this.postSelected.emit(undefined);
    } else {
      this.postSelected.emit(this.post().id);
    }
  }

  onContainerClick() {
    this.checkboxRef().nativeElement.click();
    console.log('클릭');
  }
}
