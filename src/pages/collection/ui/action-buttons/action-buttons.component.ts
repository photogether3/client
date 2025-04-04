import { Component, computed, inject, signal } from '@angular/core';

import { BottomSheetService, ButtonComponent } from 'src/shared/components';

export type CollectionActionType = 'organize' | 'update' | 'delete';

@Component({
  selector: 'app-action-buttons',
  templateUrl: './action-buttons.component.html',
  standalone: true,
  imports: [ButtonComponent],
})
export class ActionButtonsComponent {
  private readonly bottomSheetService = inject<BottomSheetService<{ type: string }, CollectionActionType>>(BottomSheetService);

  type = signal<string>('');
  text = computed(() => {
    switch (this.type()) {
      case 'collection':
        return '사진첩';
      case 'post':
        return '게시물';
      default:
        return '';
    }
  });

  constructor() {
    const data = this.bottomSheetService.data();
    this.type.set(data?.type || '');
  }

  onClick(type: CollectionActionType) {
    this.bottomSheetService.close(type);
  }
}
