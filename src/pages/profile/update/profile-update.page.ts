import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CategoriesGetDTO, CategoryApi, TagComponent } from 'src/entities/category';
import { UserApi } from 'src/entities/user';
import { BottomSheetService, ButtonComponent, InputComponent, ModalReactiveService } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';
import { CategoriesUpdateDialog } from '../ui';
import { HeaderWidget } from 'src/widgets/header';
import { Router } from '@angular/router';
import { ProfileUpdateButton } from 'src/widgets/porfile-update-button';

@Component({
  selector: 'profile-update-page',
  templateUrl: './profile-update.page.html',
  imports: [TagComponent, ButtonComponent, FooterWidget, ReactiveFormsModule, JsonPipe, HeaderWidget, InputComponent, ProfileUpdateButton],
})
export class ProfileUpdatePage {
  public profileUpdateForm!: FormGroup;

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly userApi = inject(UserApi);
  private readonly categoryApi = inject(CategoryApi);
  private readonly bottomSheetService = inject(BottomSheetService);
  private readonly modalReactiveService = inject(ModalReactiveService);

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
      categories: this.categoryApi.fetchFavCategories(),
    }).subscribe(({ profile, categories }) => {
      this.profileUpdateForm.patchValue({
        nickname: profile.nickname,
        bio: profile.bio,
      });

      categories.forEach((category) => this.categoryArray.push(this.fb.control(category)));
    });
  }

  // 사용자 이미지 업데이트
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.profileUpdateForm.patchValue({ file });

      const reader = new FileReader();
      reader.readAsDataURL(file);
      console.log(this.profileUpdateForm.value);
    }
  }

  updateCategory() {
    const categoryArray = this.categoryArray.value;
    this.bottomSheetService.open(CategoriesUpdateDialog, categoryArray).subscribe((res) => {
      if (!res) return;

      this.categoryArray.clear();
      res.forEach((category: CategoriesGetDTO) => this.categoryArray.push(this.fb.control(category)));
    });
  }

  updateProfile() {
    const modalData = {
      title: '프로필 편집 완료',
      subTitle: '프로필 편집이 완료되었습니다.',
      content: '확인 버튼을 누르시면 홈 화면으로 돌아갑니다. 확인버튼을 눌러주세요.',
      buttons: ['확인'],
    };
    this.modalReactiveService.open(modalData).subscribe(() => {
      this.router.navigateByUrl('/profile');
    });
  }
}
