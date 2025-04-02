import { Component, inject } from '@angular/core';

import { BottomSheetService, ButtonComponent } from 'src/shared/components';

export type CollectionActionType = 'organize' | 'update' | 'delete';

@Component({
  selector: 'app-action-buttons',
  templateUrl: './action-buttons.component.html',
  standalone: true,
  imports: [ButtonComponent],
})
export class ActionButtonsComponent {
  private readonly bottomSheetService = inject<BottomSheetService<void, CollectionActionType>>(BottomSheetService);

  onClick(type: CollectionActionType) {
    this.bottomSheetService.close(type);
  }
}
