export const stringifyQueryParams = (
  queryParams: Record<string, any>
): Record<string, string> => {
  return Object.entries(queryParams).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null) {
      acc[key] = String(value);
    }
    return acc;
  }, {} as Record<string, string>);
};
