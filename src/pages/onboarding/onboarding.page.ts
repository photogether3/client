import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { CategoriesGetDTO } from 'src/entities/category';
import { ButtonComponent } from 'src/shared/components';
import { CategorySelectorWidget } from 'src/widgets/category-selector';
import { HeaderWidget } from 'src/widgets/header';
import { ProfileUpdateButton } from 'src/widgets/porfile-update-button';
import { ProfileUpdateForm } from 'src/widgets/profile-update-form';

@Component({
  selector: 'onboarding-page',
  templateUrl: './onboarding.page.html',
  imports: [ButtonComponent, ProfileUpdateForm, CategorySelectorWidget, CommonModule, HeaderWidget, ProfileUpdateButton, ProfileUpdateForm],
})
export class OnboardingPage {
  // TODO 온보딩 페이지 파일 업로드 기능
  activeStep = signal(1);
  selectedCategoryList = signal<CategoriesGetDTO[]>([]);

  private readonly router = inject(Router);

  constructor() {}

  setStep(step: number) {
    this.activeStep.set(step);
  }

  updateSelectedCategories(updatedList: CategoriesGetDTO[]) {
    this.selectedCategoryList.set(updatedList);
  }

  updateProfile() {
    this.router.navigateByUrl('/home');
  }
}
