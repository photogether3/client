import { Injectable, signal } from '@angular/core';

export type ThemeType = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  theme = signal<ThemeType>('light');
  private themeKey = 'theme';

  constructor() {
    this.loadTheme();
  }

  toggleTheme() {
    const updatedTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.setTheme(updatedTheme);
  }

  setTheme(theme: ThemeType) {
    this.theme.set(theme);
    localStorage.setItem(this.themeKey, theme);

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }

  loadTheme() {
    const savedTheme = localStorage.getItem(this.themeKey) as ThemeType | null;

    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDarkMode ? 'dark' : 'light');
    }
  }
}
