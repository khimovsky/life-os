import { InjectionToken } from "@angular/core";

export const APP_LANGUAGE_SETTER = new InjectionToken<(lang: string) => void>(
  "APP_LANGUAGE_SETTER",
);
