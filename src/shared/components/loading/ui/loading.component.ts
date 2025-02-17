import { Component } from '@angular/core';
import { ButtonComponent } from '../../button';

@Component({
  selector: 'app-loading',
  templateUrl: 'loading.component.html',
  styles: `
    :host {
      position: absolute;
    }
  `,
  imports: [ButtonComponent],
})
export class LoadingComponent {
  constructor() {}
}
