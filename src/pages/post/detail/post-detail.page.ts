import { Component } from '@angular/core';
import { PostType } from 'src/entities/post';
import { ButtonComponent } from 'src/shared/components';
import { FooterWidget } from './../../../widgets/footer/footer.widget';

@Component({
  selector: 'post-detail-page',
  templateUrl: './post-detail.page.html',
  imports: [ButtonComponent, FooterWidget],
})
export class PostDetailPage {
  public post: PostType | undefined = undefined;

  constructor() {}
}
