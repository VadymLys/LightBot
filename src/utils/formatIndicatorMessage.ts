import { IndicatorResponse, IndicatorValue } from "../types/types.js";
import { finalValues } from "./PricesUtils.js";

export const formatIndicatorMessage = (data: IndicatorResponse): string[] => {
  const peninsulaValues = (data.indicator?.values || []).filter(
    (v: IndicatorValue | undefined) => v !== undefined && v.geo_id === 8741
  );
  const processed = peninsulaValues.map((v: IndicatorValue) => finalValues(v));

  return processed.map(
    (item) =>
      `${item.display}:00 - Base: ${item.baseValue}MWh - Final: ${item.finalValue}kWh`
  );
};
