import { CommonModule, JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoriesDTO, CategoryApi, TagComponent } from 'src/entities/category';
import { UserApi } from 'src/entities/user';
import { ButtonComponent, InputComponent } from 'src/shared/components';

@Component({
  selector: 'onboarding-page',
  templateUrl: './onboarding.page.html',
  imports: [ReactiveFormsModule, ButtonComponent, TagComponent, JsonPipe, CommonModule, InputComponent],
})
export class OnboardingPage {
  public initForm!: FormGroup;
  public activeStep = signal(1);
  public categoryList: CategoriesDTO[] = [];

  private fb = inject(FormBuilder);
  private readonly categoryApi = inject(CategoryApi);
  private readonly userApi = inject(UserApi);
  private readonly router = inject(Router);

  get categoryFormArray() {
    return this.initForm.get('categoryIds') as FormArray;
  }

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
    const index = this.categoryFormArray.value.findIndex((id: string) => id === categoryId);

    if (index === -1) {
      this.categoryFormArray.push(this.fb.control(categoryId));
    } else {
      this.categoryFormArray.removeAt(index);
    }
  }

  submit() {
    const { nickname, bio, categoryIds } = this.initForm.value;
    const updateProfileDTO = { nickname, bio, categoryIds: JSON.stringify(categoryIds) };
    this.userApi.updateProfile(updateProfileDTO).subscribe(() => {
      this.router.navigateByUrl('/home');
    });
  }
}
