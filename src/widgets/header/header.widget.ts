import { Component, input } from '@angular/core';

import { IconComponent } from 'src/shared/components';

@Component({
  selector: 'app-header',
  templateUrl: './header.widget.html',
  imports: [IconComponent],
  host: {
    class: 'sticky top-0 z-40 pt-[env(safe-area-inset-top)]',
  },
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
