import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { afterRender, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { AuthApi } from 'src/entities/auth';
import { IconComponent, LoadingComponent } from 'src/shared/components';

@Component({
  selector: 'app-policy-detail',
  templateUrl: './policy-detail.component.html',
  imports: [IconComponent, LoadingComponent],
  host: {
    class: 'h-full  flex flex-col',
  },
})
export class PolicyDetailComponent {
  private readonly dialogRef = inject(DialogRef);
  private readonly dialogData = inject(DIALOG_DATA);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly authApi = inject(AuthApi);

  container = viewChild.required<ElementRef>('container');
  content = signal<SafeHtml>('');

  constructor() {
    if (!this.dialogData.id) {
      this.close();
    }

    this.authApi.getPolicy(this.dialogData.id).subscribe((res) => {
      if (!res) return;

      const content = this.sanitizer.bypassSecurityTrustHtml(res.content);
      this.content.set(content);
    });

    // DOM 업데이트 이후에 실행
    // queueMicrotask(() => this.styleHtmlTags());

    afterRender(() => {
      const title = this.container().nativeElement.querySelectorAll('h2');
      title.forEach((text: any) => text.classList.add('text-body-s', 'font-bold', 'my-2'));

      const text = this.container().nativeElement.querySelectorAll('p');
      text.forEach((text: any) => text.classList.add('text-gray40', 'text-detail-l'));

      const liTags = this.container().nativeElement.querySelectorAll('li');
      liTags.forEach((el: HTMLElement) => el.classList.add('text-gray40', 'text-detail-l'));
    });
  }

  close() {
    this.dialogRef.close();
  }
}
