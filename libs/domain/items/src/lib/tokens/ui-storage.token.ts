import { InjectionToken } from "@angular/core";

export interface UIStorageContract {
  getItem<T>(key: string, fallback: T): T;
  setItem<T>(key: string, value: T): void;
}

export const UI_STORAGE = new InjectionToken<UIStorageContract>("UI_STORAGE");
