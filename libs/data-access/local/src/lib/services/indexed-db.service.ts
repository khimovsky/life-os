import { Injectable } from "@angular/core";
import { LifeOsDatabase } from "../database/life-os.database";

@Injectable({
  providedIn: "root",
})
export class IndexedDbService {
  private readonly database = new LifeOsDatabase();
  private openingPromise: Promise<void> | null = null;

  public async open(): Promise<void> {
    if (this.database.isOpen()) {
      return;
    }

    if (this.openingPromise) {
      return this.openingPromise;
    }

    this.openingPromise = this.database
      .open()
      .then(() => undefined)
      .finally(() => {
        this.openingPromise = null;
      });

    return this.openingPromise;
  }

  public isOpen(): boolean {
    return this.database.isOpen();
  }

  public close(): void {
    this.database.close();
  }
}
