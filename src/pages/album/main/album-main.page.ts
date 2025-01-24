import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlbumApi, AlbumDTO } from 'src/entities/album';
import { ButtonComponent, IconComponent, TagComponent } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';

@Component({
  selector: 'app-album-main',
  templateUrl: './album-main.page.html',
  imports: [TagComponent, FooterWidget, ButtonComponent],
})
export class AlbumMainPage implements OnInit {
  public album: AlbumDTO | undefined = undefined;

  private readonly route = inject(ActivatedRoute);
  private readonly albumApi = inject(AlbumApi);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') as string;
    this.albumApi.getCollection(parseInt(id, 10)).subscribe((res) => {
      this.album = res;
    });
  }
}
