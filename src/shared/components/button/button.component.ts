import { Component, computed, input } from '@angular/core';
import { ButtonProps, buttonStyles } from './button.styles';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  text = input.required();
  type = input<'button' | 'submit'>('button');
  isDisabled = input<boolean>(false);
  appearance = input<ButtonProps['type']>();
  size = input<ButtonProps['size']>();
  width = input<ButtonProps['width']>();

  computedClass = computed(() => {
    return twMerge(buttonStyles({ type: this.appearance(), size: this.size(), width: this.width() }));
  });

  constructor() {}
}
