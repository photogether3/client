import { CommonModule } from '@angular/common';
import { Component, effect, inject, viewChild, ViewContainerRef } from '@angular/core';

import { RegisterStepService } from 'src/pages/register/services';
import { HeaderWidget } from 'src/widgets/header';

import { EmailCheckComponent, OtpVerifyFormComponent } from './pages';

@Component({
  selector: 'otp-verify-page',
  templateUrl: './otp-verify.page.html',
  imports: [CommonModule, HeaderWidget],
  providers: [RegisterStepService, HeaderWidget],
})
export class OtpVerifyPage {
  private readonly registerStepService = inject(RegisterStepService);

  readonly totalSteps = this.registerStepService.totalSteps;
  readonly currentStep = this.registerStepService.currentStep;
  private readonly dynamicViewRef = viewChild.required('dynamicView', {
    read: ViewContainerRef,
  });

  constructor() {
    this.registerStepService.addComponent(EmailCheckComponent);
    this.registerStepService.addComponent(OtpVerifyFormComponent);

    effect(() => this.render());
  }

  private render() {
    if (!this.dynamicViewRef()) {
      throw new Error('다이나믹 뷰가 초기화되지 않았습니다.');
    }

    this.dynamicViewRef().clear();

    const component = this.registerStepService.currentComponent();
    if (!component) {
      throw new Error('컴포넌트를 찾을 수 없습니다.');
    }

    this.dynamicViewRef().createComponent(component);
  }
}
