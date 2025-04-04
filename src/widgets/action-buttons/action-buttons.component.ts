import { Component, computed, inject, signal } from '@angular/core';

import { BottomSheetService, ButtonComponent } from 'src/shared/components';
import { ButtonProps } from 'src/shared/components/button/button.styles';

export type ActionButtonType = {
  type: string;
  icon: string;
  appearance: ButtonProps['type'];
  text: string;
};

@Component({
  selector: 'app-action-buttons',
  templateUrl: './action-buttons.component.html',
  imports: [ButtonComponent],
})
export class ActionButtonsComponent {
  private readonly bottomSheetService = inject<BottomSheetService<ActionButtonType[], string>>(BottomSheetService);

  actionTypes = signal<ActionButtonType[]>([]);

  constructor() {
    const data = this.bottomSheetService.data();
    this.actionTypes.set(data || []);
  }

  handleClick(type: string) {
    this.bottomSheetService.close(type);
  }
}
