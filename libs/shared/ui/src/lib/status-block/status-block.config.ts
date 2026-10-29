import { Status, StatusData } from "./status-block.types";

export const STATUS_DATA: Record<Status, StatusData> = {
  error: {
    img: "assets/images/cancel.svg",
    label: "common.error.title",
    description: "common.error.description",
  },
  empty: {
    img: "assets/images/going-up.svg",
    label: "common.error.empty",
  },
  development: {
    img: "assets/images/camping.svg",
    label: "pages.development.title",
    description: "pages.development.description",
  },
};
