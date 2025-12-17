/**
 * Represents a custom request error.
 * Extends the native JavaScript Error class to include additional properties such as the HTTP status code,
 * the request method, and additional details about the error.
 * @example
 * const error = new RequestError('Not Found', 404, 'GET', { resource: 'User' });
 * console.log(error.toString());
 */
export class RequestError extends Error {
  public statusCode: number;
  public method: string;
  public details: Record<string, unknown>;

  constructor(
    message: string,
    statusCode = 500,
    method = 'UNKNOWN',
    details: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = 'RequestError';
    this.statusCode = statusCode;
    this.method = method;
    this.details = details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequestError);
    }
  }

  /**
   * Converts the error to a JSON object.
   * @returns The JSON object representing the error.
   * @example
   * const error = new RequestError('Not Found', 404, 'GET', { resource: 'User' });
   * console.log(error.toJSON());
   */
  public toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      method: this.method,
      details: this.details,
    };
  }

  /**
   * Converts the error to a string.
   * @returns The string representation of the error.
   * @example
   * const error = new RequestError('Not Found', 404, 'GET', { resource: 'User' });
   * console.log(error.toString());
   */
  public toString(): string {
    return `${this.name} [${this.method}] (Status: ${this.statusCode}): ${this.message} - Details: ${JSON.stringify(this.details)}`;
  }
}
