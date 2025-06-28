export const today = new Date();
export const tomorrow = new Date(today);
export const yesterday = new Date(today);

yesterday.setDate(today.getDate() - 1);
tomorrow.setDate(today.getDate() + 1);

export const toISODate = (date: Date) =>
  date.toISOString().split(".")[0] + "+02:00";
