import { Component, input, model } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icon';

@Component({
  selector: 'app-search-bar',
  templateUrl: 'search-bar.component.html',
  imports: [IconComponent, FormsModule],
})
export class SearchBarComponent {
  placeholder = input<string>('');
  value = model<string>('');

  constructor() {}

  onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }

  resetValue() {
    this.value.set('');
  }
}
