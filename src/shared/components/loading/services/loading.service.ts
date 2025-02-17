import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  public loading = signal(false);

  constructor() {}

  setLoading(isLoading: boolean) {
    this.loading.set(isLoading);
  }
}
