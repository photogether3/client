import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BottomSheetService } from '../../services';

@Component({
  selector: 'app-bottom-sheet-layout',
  templateUrl: './bottom-sheet-layout.component.html',
  styles: `
    :host {
      display: flex;
      justify-center: center;
      align-content: center;
    }
  `,
  imports: [CommonModule],
})
export class BottomSheetLayout {
  private readonly bottomSheetService = inject(BottomSheetService);

  component = this.bottomSheetService.component();

  constructor() {}
}
