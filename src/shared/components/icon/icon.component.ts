import { Component, input } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  imports: [SvgIconComponent],
})
export class IconComponent {
  public name = input.required();
  public styleClass = input<string>();

  constructor() {}
}
