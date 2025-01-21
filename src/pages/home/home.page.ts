import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from 'src/shared/components';
import { FooterWidget } from 'src/widgets/footer';
import { AlbumCardComponent } from './components';

@Component({
  selector: 'home-page',
  templateUrl: './home.page.html',
  imports: [FooterWidget, IconComponent, AlbumCardComponent],
})
export class HomePage {
  private router = inject(Router);
  public images = [
    { src: 'https://i.pinimg.com/564x/27/d7/03/27d7039fc6b3e14d55813a1a225d8e5a.jpg', alt: '짱구사진' },
    {
      src: 'https://mblogthumb-phinf.pstatic.net/MjAyNDAzMDZfMjcy/MDAxNzA5Njk1MjkyNDg4.xm34PK1ywuW_kxTr87KasLSB49xRFOIu1ARVLPyJCsAg.2ZqUYCohSogp6l-liqL8akJ7O5Zoxw3RHGckwOJXKU8g.JPEG/SE-6CB03CE3-A132-42CC-AEF9-13D1F94172DD.jpg?type=w800',
      alt: '짱구사진',
    },
    {
      src: 'https://mblogthumb-phinf.pstatic.net/MjAyMTA4MDJfMTM3/MDAxNjI3ODY3Mjg4NzA2.LYzEC3n2-LZ9nekwfwcviDfRQRC91Eec4TO5SmYQuIkg.EtgVKqrz_PmQeiZ-hJCGf9qvFjA__prA-70BuwnqjXQg.JPEG.wenice777/3.jpeg?type=w800',
      alt: '짱구사진',
    },
  ];

  constructor() {}
}
