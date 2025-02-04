import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CollectionApi } from 'src/entities/collection';
import { ButtonComponent, TagComponent } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';

@Component({
  selector: 'app-collection-main',
  templateUrl: './collection-main.page.html',
  imports: [TagComponent, FooterWidget, ButtonComponent],
})
export class CollectionMainPage implements OnInit {
  public collection: any | undefined = undefined;

  private readonly route = inject(ActivatedRoute);
  private readonly collectionApi = inject(CollectionApi);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') as string;
    this.collectionApi.getCollection(parseInt(id, 10)).subscribe((res) => {
      this.collection = res;
    });
  }
}
