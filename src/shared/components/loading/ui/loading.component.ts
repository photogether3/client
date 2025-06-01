import { Component } from '@angular/core';

import { AnimationOptions, LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'app-loading',
  templateUrl: 'loading.component.html',
  imports: [LottieComponent],
  host: {
    class: 'absolute z-[999]',
  },
})
export class LoadingComponent {
  styles: Partial<CSSStyleDeclaration> = {
    width: '200px',
    margin: '0 auto',
  };

  options: AnimationOptions = {
    path: '/assets/lottie/loading.json',
  };

  constructor() {}
}
