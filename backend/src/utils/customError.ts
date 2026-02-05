export class CustomError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
      super(message);
      this.statusCode = statusCode;
        
      Object.setPrototypeOf(this, CustomError.prototype);
    }
}

export function createCustomError(statusCode: number, message: string) {
  return new CustomError(statusCode, message);
}