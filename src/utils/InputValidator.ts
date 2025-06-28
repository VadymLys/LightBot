export class InputValidator {
  static isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined;
  }

  static isEmptyString(value: any): boolean {
    return value.trim() === "" || this.isNullOrUndefined(value);
  }

  static isEmpty(value: any): boolean {
    if (this.isEmptyString(value) || this.isNullOrUndefined(value)) return true;

    if (Array.isArray(value)) {
      return value.length === 0;
    }

    if (typeof value === "object") {
      return Object.keys(value).length === 0;
    }
    return false;
  }

  static isNumber(value: any): boolean {
    return typeof value === "number" && !isNaN(value);
  }

  static isPositive(value: any): boolean {
    return this.isNumber(value) && value > 0;
  }

  static isEmail(value: any): boolean {
    const regexEmail = /^[^s@]+@[^s@]+.[^s@]+$/;
    return typeof value === "string" && regexEmail.test(value);
  }

  static isUrl(value: any): boolean {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  static isUUID(value: any): boolean {
    const regexUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return typeof value === "string" && regexUUID.test(value);
  }

  static isDate(value: any): boolean {
    return value instanceof Date && !isNaN(value.getTime());
  }

  static isValidDateString(value: any): boolean {
    return typeof value === "string" && !isNaN(Date.parse(value));
  }

  static isInRange(value: number, min: number, max: number): boolean {
    return this.isNumber(value) && value >= min && value <= max;
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
