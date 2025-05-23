import { Component, input } from '@angular/core';

import { IconComponent } from 'src/shared/components';

@Component({
  selector: 'app-header',
  templateUrl: './header.widget.html',
  imports: [IconComponent],
  host: {
    class: 'sticky top-0 z-40 pt-[env(safe-area-inset-top)] shadow-[2px_5px_8px_0_rgba(0,0,0,0.2)] backdrop-blur-[20px] bg-[#1b1d21]/80',
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
