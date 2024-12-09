import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'home-page',
  templateUrl: './home.page.html',
  imports: []
})
export class HomePage {
  private router = inject(Router);

  constructor() { }
}
