import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent, IconComponent } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';
import { AlbumCardComponent } from './components';
import { CommonModule } from '@angular/common';
import { AlbumApi, AlbumDTO } from 'src/entities/album';

@Component({
  selector: 'home-page',
  templateUrl: './home.page.html',
  imports: [FooterWidget, IconComponent, AlbumCardComponent, ButtonComponent, CommonModule],
})
export class HomePage {
  private router = inject(Router);
  private albumApi = inject(AlbumApi);
  public albumList: AlbumDTO[] | undefined = undefined;

  constructor() {
    this.albumApi.getCollections().subscribe((res) => {
      this.albumList = res;
    });
  }
}
