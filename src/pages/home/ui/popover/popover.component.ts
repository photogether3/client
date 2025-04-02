import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

import { IconComponent } from 'src/shared/components';

export type PopoverItemType = {
  icon: string;
  label: string;
  color?: string;
  action: () => void;
};

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  imports: [CommonModule, IconComponent],
})
export class PopoverComponent {
  items = input<PopoverItemType[]>([]);

  constructor() {}
}
