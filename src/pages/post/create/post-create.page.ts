import { Component, effect, inject, viewChild, ViewContainerRef } from '@angular/core';
import { StepService } from 'src/shared/services';
import { HeaderWidget } from 'src/widgets/header';
import { PostFormComponent } from '../ui';
import { CollectionSelectComponent } from './ui/collection-select/collection-select.component';

@Component({
  selector: 'post-create-page',
  templateUrl: './post-create.page.html',
  imports: [HeaderWidget],
  providers: [StepService],
  host: {
    class: 'h-screen flex flex-col',
  },
})
export class PostCreatePage {
  private readonly stepService = inject(StepService);

  readonly totalSteps = this.stepService.totalSteps;
  readonly currentStep = this.stepService.currentStep;
  private readonly dynamicViewRef = viewChild.required('dynamicView', {
    read: ViewContainerRef,
  });

  constructor() {
    this.stepService.addComponent(PostFormComponent);
    this.stepService.addComponent(CollectionSelectComponent);

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
