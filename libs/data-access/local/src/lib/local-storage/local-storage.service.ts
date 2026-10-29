import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LocalStorageService {
  public setItem<T>(key: string, value: T): void {
    try {
      const current = this.getItem<T>(key);
      if (current === value) return;
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing key "${key}" to localStorage`, error);
    }
  }

  public getItem<T>(key: string): T | null;
  public getItem<T>(key: string, defaultValue: T): T;
  public getItem<T>(key: string, defaultValue?: T): T | null {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue !== undefined ? defaultValue : null;
    try {
      return JSON.parse(item) as T;
    } catch {
      return item as unknown as T;
    }
  }

  public removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  public clear(): void {
    localStorage.clear();
  }
}
