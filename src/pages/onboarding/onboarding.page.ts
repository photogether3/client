import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CategoriesDTO, CategoryApi } from 'src/entities/category';
import { ButtonComponent, TagComponent } from 'src/shared/components';

@Component({
  selector: 'onboarding-page',
  templateUrl: './onboarding.page.html',
  imports: [ReactiveFormsModule, ButtonComponent, TagComponent],
})
export class OnboardingPage {
  public initForm!: FormGroup;
  public activeStep = signal(2);
  public categoryList: CategoriesDTO[] = [];

  private fb = inject(FormBuilder);
  private categoryApi = inject(CategoryApi);

  constructor() {
    this.initForm = this.fb.group({
      nickname: '',
      bio: '',
      categoryIds: this.fb.array([]),
    });

    this.categoryApi.fetchCategories().subscribe((res) => {
      this.categoryList = res;
    });
  }

  setStep(step: number) {
    this.activeStep.set(step);
  }

  toggleCategory(categoryId: string) {
    console.log(categoryId);
  }

  submit() {
    console.log('자기소개 제출');
  }
}
