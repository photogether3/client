import { Component, input } from '@angular/core';

import { IconComponent } from 'src/shared/components';

@Component({
  selector: 'app-header',
  templateUrl: './header.widget.html',
  styles: `
    :host {
      position: sticky;
      top: 0;
      z-index: 40;
    }
  `,
  imports: [IconComponent],
})
export class HeaderWidget {
  title = input<string>('');
  hasLogo = input<boolean>(false);
  hasBackButton = input<boolean>(true);

  constructor() {}

  // 뒤로가기
  goBack() {
    history.back();
  }
}
