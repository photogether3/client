import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { AnimationItem } from 'node_modules/ngx-lottie/lib/symbols';

import { CategoryService } from 'src/entities/category';
import { ProfileFormType } from 'src/entities/user/model/user.type';
import { ButtonComponent } from 'src/shared/components';
import { CategorySelectorWidget } from 'src/widgets/category-selector';
import { FooterWidget } from 'src/widgets/footer';
import { HeaderWidget } from 'src/widgets/header';
import { ProfileUpdateButton } from 'src/widgets/profile-update-button';
import { ProfileUpdateForm } from 'src/widgets/profile-update-form';

@Component({
  selector: 'onboarding-page',
  templateUrl: './onboarding.page.html',
  standalone: true,
  imports: [CommonModule, ButtonComponent, ProfileUpdateForm, CategorySelectorWidget, HeaderWidget, FooterWidget, ProfileUpdateButton, LottieComponent],
  providers: [CategoryService],
})
export class OnboardingPage {
  private readonly router = inject(Router);
  private readonly categoryService = inject(CategoryService);

  readonly selectedCategories = this.categoryService.selectedCategories;

  profileForm = viewChild.required<ProfileUpdateForm>('profileForm');

  step = signal(1);
  lottieStep = signal(1);
  profileSnapshot = signal<ProfileFormType | undefined>(undefined);
  hasLottie = signal<boolean>(true);
  options = signal<AnimationOptions>({
    path: '/assets/lottie/onb1.json',
  });

  readonly stepContents = [
    {
      title: '스크린샷을 찍어주세요.',
      subtitle: '기존의 사진첩에 보관중인 스크린샷도 괜찮아요!',
    },
    {
      title: '업로드 버튼을 눌러주세요.',
      subtitle: '업로드 버튼을 눌러 정리할 스크린샷을 올려주세요!',
    },
    {
      title: '자동으로 텍스트를 추출합니다.',
      subtitle: '텍스트를 추출하고 태그를 달아 찾기 쉽게 분류하세요!',
    },
  ];

  get buttonDisabled(): boolean {
    if (this.step() === 1) {
      return !this.profileForm().getRawValue().nickname;
    } else {
      return this.profileSnapshot()?.categories.length === 0;
    }
  }

  styles: Partial<CSSStyleDeclaration> = {
    paddingLeft: '60px',
    paddingRight: '60px',
    margin: '0 auto',
  };

  constructor() {
    effect(() => {
      const categories = this.selectedCategories();
      this.profileSnapshot.update((prev) => ({ ...prev!, categories }));
    });
  }

  skipLottie() {
    this.hasLottie.set(false);
  }

  updateLottieStep() {
    const nextStep = this.lottieStep() + 1;
    this.lottieStep.set(nextStep);

    if (this.lottieStep() > 3) {
      this.hasLottie.set(false);
    }

    this.options.set({
      path: `/assets/lottie/onb${nextStep}.json`,
    });
  }

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
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
