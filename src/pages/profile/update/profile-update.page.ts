import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CategoriesDTO, CategoryApi, TagComponent } from 'src/entities/category';
import { UserApi } from 'src/entities/user';
import { BottomSheetService, ButtonComponent, ModalReactiveService } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';
import { CategoriesUpdateDialog } from '../ui';
import { HeaderWidget } from 'src/widgets/header';

@Component({
  selector: 'profile-update-page',
  templateUrl: './profile-update.page.html',
  imports: [TagComponent, ButtonComponent, FooterWidget, ReactiveFormsModule, JsonPipe, HeaderWidget],
})
export class ProfileUpdatePage {
  public profileUpdateForm!: FormGroup;

  private readonly fb = inject(FormBuilder);
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
      tags: this.categoryApi.fetchFavCategories(),
    }).subscribe(({ profile, tags }) => {
      this.profileUpdateForm.patchValue({
        nickname: profile.nickname,
        bio: profile.bio,
      });

      tags.forEach((tag) => this.categoryArray.push(this.fb.control(tag)));
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
      res.forEach((category: CategoriesDTO) => this.categoryArray.push(this.fb.control(category)));
    });
  }

  updateProfile() {
    const { nickname, bio } = this.profileUpdateForm.value;
    const categoryIds = this.profileUpdateForm.get('categories')?.value.map((category: CategoriesDTO) => category.categoryId);
    const updateProfileDTO = { nickname, bio, categoryIds: JSON.stringify(categoryIds) };

    this.userApi.updateProfile(updateProfileDTO).subscribe(() => {
      const modalData = {
        title: '프로필 편집 완료',
        subTitle: '프로필 편집이 완료되었습니다.',
        content: '확인 버튼을 누르시면 홈 화면으로 돌아갑니다. 확인버튼을 눌러주세요.',
        buttons: ['확인'],
      };
      this.modalReactiveService.open(modalData).subscribe((buttonText) => {
        console.log('선택된 버튼:', buttonText);
      });
    });
  }
}
