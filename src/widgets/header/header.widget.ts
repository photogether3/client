import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from 'src/shared/components';

@Component({
  selector: 'app-header',
  templateUrl: './header.widget.html',
  styles: `
    :host {
      position: sticky;
      top: 0;
      z-index: 10;
    }
  `,
  imports: [IconComponent, RouterLink],
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
