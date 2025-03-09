import { Component, computed, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { twMerge } from 'tailwind-merge';

import { inputVariants } from './input.styles';
import { IconComponent } from '../icon';

@Component({
  selector: 'app-input',
  templateUrl: 'input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  imports: [IconComponent],
})
export class InputComponent implements ControlValueAccessor {
  label = input<string>('');
  type = input<'input' | 'textarea'>('input');
  inputType = input<'text' | 'password' | 'number' | 'email'>('text');
  placeholder = input<string>('');
  info = input<string>('');
  hasError = input<boolean>(false);
  hasInfoIcon = input<boolean>(false);

  computedClass = computed(() => {
    return twMerge(inputVariants({ type: this.type(), state: this.hasError() ? 'error' : 'default' }));
  });

  value: string = '';

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {}

  onInput(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.value = inputValue;
    this.onChange(inputValue); // formControl에 값 전달
  }

  // formControl의 값이 변경될 때 호출
  writeValue(value: string) {
    this.value = value || '';
  }

  // formControl 값 변경을 감지
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
