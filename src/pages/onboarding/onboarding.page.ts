import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CategoriesGetDTO, TagComponent } from 'src/entities/category';
import { ProfileUpdateFormType } from 'src/entities/user/model/user.type';
import { ButtonComponent, InputComponent } from 'src/shared/components';
import { BaseForm, FormControls } from 'src/shared/lib';
import { CategorySelectorWidget } from 'src/widgets/category-selector';
import { HeaderWidget } from 'src/widgets/header';
import { ProfileUpdateButton } from 'src/widgets/porfile-update-button';

@Component({
  selector: 'onboarding-page',
  templateUrl: './onboarding.page.html',
  imports: [ReactiveFormsModule, ButtonComponent, TagComponent, CategorySelectorWidget, CommonModule, InputComponent, HeaderWidget, ProfileUpdateButton],
})
export class OnboardingPage extends BaseForm<ProfileUpdateFormType> {
  // TODO 온보딩 페이지 파일 업로드 기능
  activeStep = signal(1);
  selectedCategoryList = signal<CategoriesGetDTO[]>([]);

  get categoryFormArray() {
    return this.form.get('categoryIds') as FormArray;
  }
  private readonly router = inject(Router);

  constructor() {
    super();
  }

  protected override initForm(): void {
    this.form = this.fb.group({
      nickname: new FormControl(''),
      bio: new FormControl(''),
      file: new FormControl(),
      categoryIds: this.fb.array<FormGroup<FormControls<number>>>([]),
    });
  }
  setStep(step: number) {
    this.activeStep.set(step);
  }

  updateSelectedCategories(updatedList: CategoriesGetDTO[]) {
    this.selectedCategoryList.set(updatedList);

    const updatedCategoryControls = this.selectedCategoryList().map((category) => this.fb.control(category.id));

    this.categoryFormArray.clear();
    updatedCategoryControls.forEach((control) => this.categoryFormArray.push(control));
  }

  updateProfile() {
    this.router.navigateByUrl('/home');
  }
}
