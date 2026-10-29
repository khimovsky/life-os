import {
  APP_INITIALIZER,
  ApplicationConfig,
  inject,
  isDevMode,
  provideZoneChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideTransloco, TranslocoService } from "@jsverse/transloco";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideEventPlugins } from "@taiga-ui/event-plugins";
import { TuiLanguageName, tuiLanguageSwitcher } from "@taiga-ui/i18n";
import { appRoutes } from "./app.routes";
import { TranslocoHttpLoader } from "./core/i18n/transloco-loader";
import { APP_LANGUAGE_SETTER, UI_STORAGE } from "@life-os/domain-items";
import { timer } from "rxjs";
import { LocalStorageService } from "@life-os/data-access-local";

const LANGUAGE_MAP: Partial<Record<TuiLanguageName, string>> = {
  english: "en",
  russian: "ru",
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),
    provideAnimations(),
    provideEventPlugins(),
    provideTransloco({
      config: {
        availableLangs: ["en", "ru"],
        defaultLang: "ru",
        fallbackLang: ["en", "ru"],
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    tuiLanguageSwitcher(async (language: TuiLanguageName): Promise<unknown> => {
      switch (language) {
        case "russian":
          return import("@taiga-ui/i18n/languages/russian");
        case "english":
          return import("@taiga-ui/i18n/languages/english");
        default:
          return import("@taiga-ui/i18n/languages/russian");
      }
    }),
    {
      provide: APP_LANGUAGE_SETTER,
      useFactory: () => {
        const translocoService = inject(TranslocoService);
        return (tuiLangName: TuiLanguageName) =>
          translocoService.setActiveLang(LANGUAGE_MAP[tuiLangName] || tuiLangName);
      },
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const el = document.getElementById("app-loader");
        if (!el) return;
        el.style.opacity = "0";
        timer(300).subscribe((): void => el.remove());

        const translocoService = inject(TranslocoService);
        const storage = inject(UI_STORAGE);
        const tuiLangName = storage.getItem<TuiLanguageName>("tuiLanguage", "russian");
        translocoService.setActiveLang(LANGUAGE_MAP[tuiLangName] || tuiLangName);
      },
    },
    {
      provide: UI_STORAGE,
      useExisting: LocalStorageService,
    },
  ],
};
