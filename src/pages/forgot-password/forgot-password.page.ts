import { Component, effect, inject, viewChild, ViewContainerRef } from '@angular/core';

import { StepService } from 'src/shared/services';
import { HeaderWidget } from 'src/widgets/header';

import { EmailCheckComponent, OtpVerifyFormComponent } from '../otp-verify';
import { PasswordForgotFormComponent } from './ui';

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password.page.html',
  imports: [HeaderWidget],
  providers: [StepService],
  host: {
    class: 'flex h-screen flex-col',
  },
})
export class ForgotPasswordPage {
  private readonly stepService = inject(StepService);

  readonly totalSteps = this.stepService.totalSteps;
  readonly currentStep = this.stepService.currentStep;
  private readonly dynamicViewRef = viewChild.required('dynamicView', {
    read: ViewContainerRef,
  });

  constructor() {
    this.stepService.addComponent(EmailCheckComponent);
    this.stepService.addComponent(OtpVerifyFormComponent);
    this.stepService.addComponent(PasswordForgotFormComponent);

    this.stepService.setExtraData('page', 'forgot-password');

    effect(() => this.render());
  }

  render() {
    if (!this.dynamicViewRef()) {
      throw new Error('다이나믹뷰가 초기화되지 않았습니다.');
    }

    this.dynamicViewRef().clear();

    const component = this.stepService.currentComponent();
    if (!component) {
      throw new Error('컴포넌트를 찾을 수 없습니다.');
    }

    this.dynamicViewRef().createComponent(component);
  }
}
