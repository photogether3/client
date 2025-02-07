import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostApi, PostResDTO } from 'src/entities/post';
import { ButtonComponent, TagComponent } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';

@Component({
  selector: 'app-collection-main',
  templateUrl: './collection-main.page.html',
  imports: [TagComponent, FooterWidget, ButtonComponent],
})
export class CollectionMainPage implements OnInit {
  public collection: PostResDTO | undefined = undefined;

  private readonly route = inject(ActivatedRoute);
  private readonly postApi = inject(PostApi);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') as string;
    this.postApi.getCollection(id).subscribe((res) => {
      this.collection = res;
    });
  }
}
