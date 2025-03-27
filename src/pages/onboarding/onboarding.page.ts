import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ProfileUpdateFormType } from 'src/entities/user/model/user.type';
import { ButtonComponent } from 'src/shared/components';
import { CategorySelectorWidget } from 'src/widgets/category-selector';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';
import { ProfileUpdateButton } from 'src/widgets/porfile-update-button';
import { ProfileUpdateForm } from 'src/widgets/profile-update-form';

@Component({
  selector: 'onboarding-page',
  templateUrl: './onboarding.page.html',
  imports: [ButtonComponent, ProfileUpdateForm, CategorySelectorWidget, CommonModule, HeaderWidget, ProfileUpdateButton, ProfileUpdateForm, FooterWidget],
})
export class OnboardingPage {
  private readonly router = inject(Router);

  step = signal(1);
  selectedCategoryList = signal<number[]>([]);
  updatedForm = signal<ProfileUpdateFormType>({
    nickname: '',
    bio: '',
    file: null,
    categoryIds: [],
  });

  constructor() {}

  setStep(step: number) {
    this.step.set(step);
  }

  updateSelectedCategories(updatedList: number[]) {
    this.selectedCategoryList.set(updatedList);
    this.updatedForm.update((prev) => ({ ...prev, categoryIds: this.selectedCategoryList() }));
    console.log(this.updatedForm());
  }

  updateProfile() {
    this.router.navigateByUrl('/home');
  }

  updateForm(updatedForm: ProfileUpdateFormType) {
    this.updatedForm.set(updatedForm);
  }

  clickFooterButton() {
    if (this.step() === 1) {
      return this.setStep(2);
    } else if (this.step() === 2) {
      return this.router.navigateByUrl('/home');
    }
  }
}
