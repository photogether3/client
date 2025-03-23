import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: 'loading.component.html',
  styles: `
    :host {
      position: absolute;
    }
  `,
  imports: [],
})
export class LoadingComponent {
  constructor() {}
}
