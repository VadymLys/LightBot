import { IndicatorValue } from "../types/types.js";

export const finalPrice = (price: number): number => {
  if (typeof price !== "number" || isNaN(price)) return NaN;

  const IEE = 1.05113;
  const IVA = 1.21;

  const priceWithTaxes = price * IEE * IVA;
  const finalPrice = priceWithTaxes / 1000;

  return Number(finalPrice.toFixed(4));
};

export const finalValues = (values: IndicatorValue) => {
  const basePrice = values.value;
  const finalPriceValue = finalPrice(basePrice);

  const display = new Date(values.datetime).toLocaleString("es-ES", {
    timeZone: "Europe/Madrid",
    hour: "2-digit",
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return {
    datetime: values.datetime,
    baseValue: basePrice,
    finalValue: finalPriceValue,
    display,
  };
};
