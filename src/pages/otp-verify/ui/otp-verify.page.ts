import { CommonModule } from '@angular/common';
import { Component, effect, inject, viewChild, ViewContainerRef } from '@angular/core';

import { HeaderWidget } from 'src/widgets/header';

import { EmailCheckComponent, OtpVerifyFormComponent } from './pages';
import { StepService } from 'src/shared/services';

@Component({
  selector: 'otp-verify-page',
  templateUrl: './otp-verify.page.html',
  imports: [CommonModule, HeaderWidget],
  providers: [StepService, HeaderWidget],
})
export class OtpVerifyPage {
  private readonly stepService = inject(StepService);

  readonly totalSteps = this.stepService.totalSteps;
  readonly currentStep = this.stepService.currentStep;
  private readonly dynamicViewRef = viewChild.required('dynamicView', {
    read: ViewContainerRef,
  });

  constructor() {
    this.stepService.addComponent(EmailCheckComponent);
    this.stepService.addComponent(OtpVerifyFormComponent);

    this.stepService.setExtraData('page', 'otp-verify');

    effect(() => this.render());
  }

  private render() {
    if (!this.dynamicViewRef()) {
      throw new Error('다이나믹 뷰가 초기화되지 않았습니다.');
    }

    this.dynamicViewRef().clear();

    const component = this.stepService.currentComponent();
    if (!component) {
      throw new Error('컴포넌트를 찾을 수 없습니다.');
    }

    this.dynamicViewRef().createComponent(component);
  }
}
