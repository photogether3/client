import { Component, inject } from '@angular/core';

import { ButtonComponent, IconComponent, ModalService } from 'src/shared/components';

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  imports: [IconComponent, ButtonComponent],
})
export class AccountSettingComponent {
  private readonly modalService = inject(ModalService);

  constructor() {}

  close() {
    this.modalService.close();
  }

  clickButton(type: string) {
    this.modalService.close(type);
  }
}
