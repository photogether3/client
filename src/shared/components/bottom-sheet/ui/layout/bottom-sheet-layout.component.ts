import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconComponent } from 'src/shared/components/icon';

import { BottomSheetService } from '../../services';

@Component({
  selector: 'app-bottom-sheet-layout',
  templateUrl: './bottom-sheet-layout.component.html',
  imports: [CommonModule, IconComponent],
  host: {
    class: 'w-screen',
  },
})
export class BottomSheetLayout {
  private readonly bottomSheetService = inject(BottomSheetService);

  component = this.bottomSheetService.component();

  constructor() {}

  close() {
    this.bottomSheetService.close();
  }
}
