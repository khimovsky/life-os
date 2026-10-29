import Dexie from "dexie";

export class LifeOsDatabase extends Dexie {
  public constructor() {
    super("LifeOS");

    this.version(1).stores({});
  }
}
