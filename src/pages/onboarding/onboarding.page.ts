import { CommonModule, JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoriesGetDTO, CategoryApi, TagComponent } from 'src/entities/category';
import { ButtonComponent, InputComponent } from 'src/shared/components';
import { HeaderWidget } from 'src/widgets/header';
import { ProfileUpdateButton } from 'src/widgets/porfile-update-button';

@Component({
  selector: 'onboarding-page',
  templateUrl: './onboarding.page.html',
  imports: [ReactiveFormsModule, ButtonComponent, TagComponent, JsonPipe, CommonModule, InputComponent, HeaderWidget, ProfileUpdateButton],
})
export class OnboardingPage {
  public initForm!: FormGroup;
  public activeStep = signal(1);
  public categoryList: CategoriesGetDTO[] = [];

  private fb = inject(FormBuilder);
  private readonly categoryApi = inject(CategoryApi);
  private readonly router = inject(Router);

  get categoryFormArray() {
    return this.initForm.get('categoryIds') as FormArray;
  }

  constructor() {
    this.initForm = this.fb.group({
      nickname: '',
      bio: '',
      categoryIds: this.fb.array<number[]>([]),
      file: null,
    });

    this.categoryApi.fetchCategories().subscribe((res) => {
      this.categoryList = res;
    });
  }

  setStep(step: number) {
    this.activeStep.set(step);
  }

  toggleCategory(categoryId: number) {
    const index = this.categoryFormArray.value.findIndex((id: number) => id === categoryId);

    if (index === -1) {
      this.categoryFormArray.push(this.fb.control(categoryId));
    } else {
      this.categoryFormArray.removeAt(index);
    }
  }

  updateProfile() {
    this.router.navigateByUrl('/home');
  }
}
