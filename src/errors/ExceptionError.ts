export class ExceptionError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ExceptionError.prototype);
  }
}
