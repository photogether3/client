import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CategoryApi } from 'src/entities/category';
import { UserApi } from 'src/entities/user';
import { ButtonComponent, TagComponent } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';

@Component({
  selector: 'profile-update-page',
  templateUrl: './profile-update.page.html',
  imports: [TagComponent, ButtonComponent, FooterWidget, ReactiveFormsModule, JsonPipe],
})
export class ProfileUpdatePage {
  public profileUpdateForm!: FormGroup;

  private readonly fb = inject(FormBuilder);
  private readonly userApi = inject(UserApi);
  private readonly categoryApi = inject(CategoryApi);

  get categoryArray() {
    return this.profileUpdateForm.get('categories') as FormArray;
  }

  constructor() {
    this.profileUpdateForm = this.fb.group({
      nickname: '',
      bio: '',
      categories: this.fb.array([]),
      file: '',
    });

    forkJoin({
      profile: this.userApi.getProfile(),
      tags: this.categoryApi.fetchFavCategories(),
    }).subscribe(({ profile, tags }) => {
      this.profileUpdateForm.patchValue({
        nickname: profile.nickname,
        bio: profile.bio,
      });

      tags.forEach((tag) => this.categoryArray.push(this.fb.control(tag)));

      console.log(profile);
      console.log(this.profileUpdateForm.value);
    });
  }

  // 사용자 이미지 업데이트
  onFileSelected(event: Event) {
    alert('기능 개발중 ...');
  }

  updateCategory() {
    alert('기능 개발중 ..');
  }

  updateProfile() {
    alert('프로필 편집 기능 개발중 ...');
  }
}
