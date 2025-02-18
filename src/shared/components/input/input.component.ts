import { Component, computed, forwardRef, input } from '@angular/core';
import { twMerge } from 'tailwind-merge';
import { InputProps, inputVariants } from './input.styles';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
})
export class InputComponent implements ControlValueAccessor {
  public label = input<string>('');
  public type = input<'input' | 'textarea'>('input');
  public inputType = input<'text' | 'password' | 'number' | 'email'>('text');
  public placeholder = input<string>('');
  public size = input<InputProps['size']>('lg');
  public computedClass = computed(() => {
    return twMerge(inputVariants({ size: this.size() }));
  });

  public value: string = '';
  public isDisabled: boolean = false;

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

  // formControl disalbe() 상태 반영
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
