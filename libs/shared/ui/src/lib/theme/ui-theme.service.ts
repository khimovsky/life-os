import {
  computed,
  DestroyRef,
  effect,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from "@angular/core";
import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import { TUI_DARK_MODE } from "@taiga-ui/core";

import type { UiResolvedTheme, UiThemeMode } from "./ui-theme.types";

const STORAGE_KEY = "lifeos-theme-mode";
const SYSTEM_THEME_QUERY = "(prefers-color-scheme: dark)";

@Injectable({
  providedIn: "root",
})
export class UiThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly tuiDarkMode = inject(TUI_DARK_MODE);

  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly systemDark = signal(false);

  public readonly mode = signal<UiThemeMode>("system");

  public readonly resolvedTheme = computed<UiResolvedTheme>(() => {
    const mode = this.mode();
    if (mode === "system") {
      return this.systemDark() ? "dark" : "light";
    }
    return mode;
  });

  public readonly isDark = computed(() => this.resolvedTheme() === "dark");

  constructor() {
    this.initialize();

    effect(
      () => {
        const theme = this.resolvedTheme();
        this.applyTheme(theme);
      },
      { allowSignalWrites: true },
    );
  }

  public setMode(mode: UiThemeMode): void {
    this.mode.set(mode);

    if (this.isBrowser) {
      try {
        this.document.defaultView?.localStorage.setItem(STORAGE_KEY, mode);
      } catch {
        // The error does not require additional handling
      }
    }
  }

  public toggle(): void {
    this.setMode(this.isDark() ? "light" : "dark");
  }

  private initialize(): void {
    if (!this.isBrowser) {
      return;
    }

    const win = this.document.defaultView;
    if (!win) {
      return;
    }

    const mediaQuery = win.matchMedia(SYSTEM_THEME_QUERY);
    this.systemDark.set(mediaQuery.matches);

    const onSystemThemeChange = (event: MediaQueryListEvent): void => {
      this.systemDark.set(event.matches);
    };

    mediaQuery.addEventListener("change", onSystemThemeChange);

    this.destroyRef.onDestroy(() => {
      mediaQuery.removeEventListener("change", onSystemThemeChange);
    });

    try {
      const savedMode = win.localStorage.getItem(STORAGE_KEY);

      if (savedMode === "light" || savedMode === "dark" || savedMode === "system") {
        this.mode.set(savedMode);
      }
    } catch {
      // The error does not require additional handling
    }
  }

  private applyTheme(theme: UiResolvedTheme): void {
    const root = this.document.documentElement;
    root.setAttribute("data-theme", theme);
    this.tuiDarkMode.set(theme === "dark");
  }
}
