import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from 'src/shared/components';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.widget.html',
  imports: [IconComponent, RouterLink],
})
export class FooterWidget {
  constructor() {}
}
