export const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${import.meta.env.VITE_API_ORIGIN}/content/weblarek`;

const RU = {
  SOFT: "\u0441\u043e\u0444\u0442-\u0441\u043a\u0438\u043b",
  HARD: "\u0445\u0430\u0440\u0434-\u0441\u043a\u0438\u043b",
  BUTTON: "\u043a\u043d\u043e\u043f\u043a\u0430",
  EXTRA: "\u0434\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c\u043d\u043e\u0435",
  OTHER: "\u0434\u0440\u0443\u0433\u043e\u0435",
} as const;

export const categoryMap: Record<string, string> = {
  [RU.SOFT]: "card__category_soft",
  [RU.HARD]: "card__category_hard",
  [RU.BUTTON]: "card__category_button",
  [RU.EXTRA]: "card__category_additional",
  [RU.OTHER]: "card__category_other",
};
