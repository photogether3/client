import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { customTwMerge, TagProps, tagVariants } from './tag.styles';

@Component({
  selector: 'app-tag',
  templateUrl: 'tag.component.html',
  imports: [CommonModule],
})
export class TagComponent {
  tagName = input.required();
  size = input<TagProps['size']>();
  type = input<TagProps['type']>();

  computedClass = computed(() => {
    return customTwMerge(tagVariants({ type: this.type(), size: this.size() }));
  });
}
// TODO customTwMerge shared로 분리해야 함
