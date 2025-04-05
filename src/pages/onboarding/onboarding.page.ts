import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';

import { CategoriesGetDTO } from 'src/entities/category';
import { ProfileFormType } from 'src/entities/user/model/user.type';
import { ButtonComponent, ModalReactiveService } from 'src/shared/components';
import { CategorySelectorWidget } from 'src/widgets/category-selector';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';
import { ProfileUpdateButton } from 'src/widgets/porfile-update-button';
import { ProfileUpdateForm } from 'src/widgets/profile-update-form';

@Component({
  selector: 'onboarding-page',
  templateUrl: './onboarding.page.html',
  standalone: true,
  imports: [CommonModule, ButtonComponent, ProfileUpdateForm, CategorySelectorWidget, HeaderWidget, FooterWidget, ProfileUpdateButton],
})
export class OnboardingPage {
  private readonly router = inject(Router);
  private readonly modalReactiveService = inject(ModalReactiveService);

  step = signal(1);
  profileForm = viewChild.required<ProfileUpdateForm>('profileForm');
  profileSnapshot = signal<ProfileFormType | undefined>(undefined);

  get buttonDisabled(): boolean {
    if (this.step() === 1) {
      return !this.profileForm().getRawValue().nickname;
    } else {
      return this.profileSnapshot()?.categories.length === 0;
    }
  }

  constructor() {}

  setCategories(categories: CategoriesGetDTO[]) {
    this.profileSnapshot.update((prev) => ({ ...prev!, categories }));
  }

  clickFooterButton() {
    if (this.step() === 1) {
      this.profileSnapshot.set(this.profileForm().getRawValue());
      this.step.set(2);
    } else if (this.step() === 2) {
      this.updateProfile();
    }
  }

  updateProfile() {
    this.router.navigateByUrl('/home');
  }
}
