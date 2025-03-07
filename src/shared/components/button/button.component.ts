import { Component, computed, input } from '@angular/core';

import { IconComponent } from '../icon';

import { ButtonProps, buttonStyles, customTwMerge } from './button.styles';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styles: `
    :host {
      display: flex;
      justify-center: center;
      align-content: center;
    }
  `,
  imports: [IconComponent],
})
export class ButtonComponent {
  text = input.required();
  type = input<'button' | 'submit'>('button');
  isDisabled = input<boolean>(false);
  leftIcon = input<string>();
  rightIcon = input<string>();
  iconSize = input<number>();
  appearance = input<ButtonProps['type']>();
  size = input<ButtonProps['size']>();
  width = input<ButtonProps['width']>();

  computedClass = computed(() => {
    return customTwMerge(buttonStyles({ type: this.appearance(), size: this.size(), width: this.width() }));
  });

  constructor() {}
}
