import { ExceptionError } from "../errors/ExceptionError.js";
export class InputValidator {
  static isNullOrUndefined(value: any): void {
    if (value === null || value === undefined) {
      throw new ExceptionError("Value is null or undefined");
    }
  }

  static isEmptyString(value: any): void {
    this.isNullOrUndefined(value);

    if (typeof value !== "string") {
      throw new ExceptionError("Value is not a string");
    }

    if (value.trim() === "") {
      throw new ExceptionError("String is empty");
    }
  }

  static isEmpty(value: any): void {
    if (value === null || value === undefined) {
      throw new ExceptionError("Value is null or undefined");
    }

    if (typeof value === "string") {
      if (value.trim() === "") {
        throw new ExceptionError("String is empty");
      }
      return;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        throw new ExceptionError("Array is empty");
      }
      return;
    }

    if (typeof value === "object") {
      if (Object.keys(value).length === 0) {
        throw new ExceptionError("Object is empty");
      }
      return;
    }
  }

  static isNumber(value: any): void {
    if (typeof value !== "number" || isNaN(value)) {
      throw new ExceptionError("Value is not a valid number");
    }
  }

  static isPositive(value: any): void {
    this.isNumber(value);

    if (value <= 0) {
      throw new ExceptionError("Number is not positive");
    }
  }

  static isEmail(value: any): void {
    this.isNullOrUndefined(value);

    if (typeof value !== "string") {
      throw new ExceptionError("Value is not a string");
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexEmail.test(value)) {
      throw new ExceptionError("Value is not a valid email");
    }
  }

  static isUrl(value: any): void {
    this.isNullOrUndefined(value);

    if (typeof value !== "string") {
      throw new ExceptionError("Value is not a string");
    }

    try {
      new URL(value);
    } catch {
      throw new ExceptionError("Value is not a valid URL");
    }
  }

  static isUUID(value: any): void {
    this.isNullOrUndefined(value);

    if (typeof value !== "string") {
      throw new ExceptionError("Value is not a string");
    }

    const regexUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!regexUUID.test(value)) {
      throw new ExceptionError("Value is not a valid UUID");
    }
  }

  static isDate(value: any): void {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new ExceptionError("Value is not a valid Date");
    }
  }

  static isValidDateString(value: any): void {
    this.isNullOrUndefined(value);

    if (typeof value !== "string") {
      throw new ExceptionError("Value is not a string");
    }

    if (isNaN(Date.parse(value))) {
      throw new ExceptionError("Value is not a valid date string");
    }
  }

  static isInRange(value: any, min: number, max: number): void {
    this.isNumber(value);

    if (value < min || value > max) {
      throw new ExceptionError(`Number is not in range [${min}, ${max}]`);
    }
  }
}

class SecondaryValidator {
  static hasMinLength(value: string, min: number): boolean {
    return typeof value === "string" && value.length >= min;
  }

  static hasMaxLength(value: string, max: number): boolean {
    return typeof value === "string" && value.length <= max;
  }

  static matchesRegex(value: string, pattern: RegExp): boolean {
    return typeof value === "string" && pattern.test(value);
  }
}
