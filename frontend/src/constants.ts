export const API_URL = "http://localhost:3000";

export const SORT_OPTIONS = [
  { value: "price_asc", label: "Цена по возрастанию" },
  { value: "price_desc", label: "Цена по убыванию" },
  { value: "name_asc", label: "Название А-Я" },
  { value: "name_desc", label: "Название Я-А" },
] as const;
