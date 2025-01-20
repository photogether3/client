import { Component } from '@angular/core';
import { IconComponent } from 'src/shared/components';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.widget.html',
  imports: [IconComponent],
})
export class FooterWidget {
  constructor() {}
}
