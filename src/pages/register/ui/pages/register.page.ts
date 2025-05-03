import { Component, effect, inject, viewChild, ViewContainerRef } from '@angular/core';

import { StepService } from 'src/shared/services';

import { PolicySelectPage } from './01.policy-select';
import { RegisterFormPage } from './02.register-form';
import { OtpCheckPage } from './03.otp-check';
import { CompletePage } from './04.complete';

@Component({
  selector: 'register-page',
  templateUrl: './register.page.html',
  providers: [StepService],
})
export class RegisterPage {
  /** -------------------------------------------------------
   * PRIVATE PROPERTIES
   * -------------------------------------------------------*/

  private readonly stepService = inject(StepService);

  private readonly dynamicViewRef = viewChild.required('dynamicView', {
    read: ViewContainerRef,
  });

  constructor() {
    this.stepService.addComponent(PolicySelectPage);
    this.stepService.addComponent(RegisterFormPage);
    this.stepService.addComponent(OtpCheckPage);
    this.stepService.addComponent(CompletePage);

    effect(() => this.render());
  }

  /** -------------------------------------------------------
   * PRIVATE METHODS
   * -------------------------------------------------------*/

  private render(): void {
    if (!this.dynamicViewRef()) {
      throw new Error('다이나믹뷰가 초기화되지 않았습니다.');
    }

    // 다이나믹뷰의 현재 컴포넌트 제거
    this.dynamicViewRef().clear();

    // 현재 컴포넌트 불러오기
    // effect 내부에서 자동으로 바뀌는 이유는
    // currentComponent 의 computed 에서 currentIndex가 변경되는걸 트리거함.
    const component = this.stepService.currentComponent();
    if (!component) {
      throw new Error('컴포넌트를 찾을 수 없습니다.');
    }

    this.dynamicViewRef().createComponent(component);
  }
}
