export const today = new Date();
export const tomorrow = new Date(today);
export const yesterday = new Date(today);

yesterday.setDate(today.getDate() - 1);
tomorrow.setDate(today.getDate() + 1);

export const toISODate = (date: Date, options?: { dateOnly: boolean }) => {
  if (options?.dateOnly) {
    return date.toISOString().split("T")[0];
  }
  return date.toISOString().split(".")[0];
};
