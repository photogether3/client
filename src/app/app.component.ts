import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent, LoadingService } from 'src/shared/components/loading';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  public isLoading = computed(() => this.loadingService.loading());

  private loadingService = inject(LoadingService);
}
