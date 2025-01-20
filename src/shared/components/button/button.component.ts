import { Component, computed, input } from '@angular/core';
import { ButtonProps, buttonVariants } from './button.styles';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  public text = input.required();
  public type = input<'button' | 'submit'>('button');
  public isDisabled = input<boolean>(false);
  public appearance = input<ButtonProps['appearance']>();
  public size = input<ButtonProps['size']>();
  public width = input<ButtonProps['width']>();

  public computedClass = computed(() => {
    return twMerge(buttonVariants({ appearance: this.appearance(), size: this.size(), width: this.width() }));
  });

  constructor() {}
}
