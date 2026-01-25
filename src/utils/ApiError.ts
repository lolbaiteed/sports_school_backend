export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details: any[];

  constructor(
    status: number,
    code: string,
    message: string,
    details: any[] = [],
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}
