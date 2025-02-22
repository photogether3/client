import { twMerge } from 'tailwind-merge';
import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagProps, tagVariants } from './tag.styles';

@Component({
  selector: 'app-tag',
  templateUrl: 'tag.component.html',
  styles: `
    :host {
      height: fit-content;
    }
  `,
  imports: [CommonModule],
})
export class TagComponent {
  public tagName = input.required();
  public size = input<TagProps['size']>();
  public appearance = input<TagProps['appearance']>();

  public computedClass = computed(() => {
    return twMerge(tagVariants({ appearance: this.appearance(), size: this.size() }));
  });
}
