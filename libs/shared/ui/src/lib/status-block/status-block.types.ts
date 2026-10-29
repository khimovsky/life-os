export type Status = "error" | "empty" | "development";

export interface StatusData {
  img: string;
  label: string;
  description?: string;
}
