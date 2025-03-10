import { CommonModule } from '@angular/common';
import { Component, ElementRef, input, signal, viewChild } from '@angular/core';
import { PostType } from 'src/entities/post';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  imports: [CommonModule],
})
export class PostCardComponent {
  post = input.required<PostType>();
  isCheckable = input<boolean>(false);

  selectedPostId = signal<number | undefined>(undefined);
  checkboxRef = viewChild.required<ElementRef<HTMLInputElement>>('checkboxRef');

  constructor() {}

  onSelect(postId: number | undefined, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedPostId.set(postId);
    }
  }

  onContainerClick() {
    this.checkboxRef().nativeElement.click();
  }
}
