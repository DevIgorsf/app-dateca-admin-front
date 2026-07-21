import { Injectable, signal } from '@angular/core';

export type AppTheme = 'light' | 'dark';

const STORAGE_KEY = 'dateca-theme';

/**
 * Fonte única do tema claro/escuro.
 *
 * Grava `data-bs-theme` no <html>, e isso basta para os três sistemas de
 * estilo do app trocarem juntos:
 *  - Bootstrap 5.3 reage nativamente ao atributo;
 *  - o atributo define `color-scheme: dark`, e o Angular Material M3 emite
 *    seus tokens com `light-dark()`, então acompanha sozinho;
 *  - os tokens do app (`--app-*`) são redefinidos no mesmo seletor.
 *
 * A preferência vai para o localStorage (não sessionStorage) para sobreviver
 * ao fechamento da aba; sem preferência salva, seguimos o sistema operacional.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly media = window.matchMedia('(prefers-color-scheme: dark)');

  /** Tema em vigor. Leitura reativa para os componentes. */
  readonly theme = signal<AppTheme>(this.resolveInitialTheme());

  constructor() {
    this.apply(this.theme());

    // Enquanto o usuário não escolher explicitamente, acompanha o sistema.
    this.media.addEventListener('change', (event) => {
      if (this.storedTheme() === null) {
        this.theme.set(event.matches ? 'dark' : 'light');
        this.apply(this.theme());
      }
    });
  }

  isDark(): boolean {
    return this.theme() === 'dark';
  }

  set(theme: AppTheme): void {
    this.theme.set(theme);
    this.apply(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  toggle(): void {
    this.set(this.isDark() ? 'light' : 'dark');
  }

  private apply(theme: AppTheme): void {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }

  private resolveInitialTheme(): AppTheme {
    return this.storedTheme() ?? (this.media.matches ? 'dark' : 'light');
  }

  private storedTheme(): AppTheme | null {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  }
}
