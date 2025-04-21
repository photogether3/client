import { Injectable, signal } from '@angular/core';

import { timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  readonly errorMessage = signal<string | null>(null);

  open(message: string, duration = 3000) {
    this.errorMessage.set(message);
    timer(duration).subscribe(() => this.clear());
  }

  clear() {
    this.errorMessage.set(null);
  }
}
