import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';

@Component({
  selector: 'post-create-page',
  templateUrl: './post-create.page.html',
  imports: [ButtonComponent, FooterWidget],
})
export class PostCreatePage {
  private readonly router = inject(Router);

  constructor() {}

  updateState() {
    alert('기능 개발중 ..');
  }
}
