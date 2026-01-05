import { describe, expect, test } from 'vitest';
import { RequestError } from '#utils/requestError';

describe('RequestError Class', () => {
  test('should create an instance with default values', () => {
    const error = new RequestError('Default error');
    expect(error).toBeInstanceOf(RequestError);
    expect(error.message).toBe('Default error');
    expect(error.statusCode).toBe(500);
    expect(error.method).toBe('UNKNOWN');
    expect(error.details).toEqual({});
  });

  test('should create an instance with custom values', () => {
    const error = new RequestError('Not Found', 404, 'GET', {
      resource: 'User',
    });
    expect(error).toBeInstanceOf(RequestError);
    expect(error.message).toBe('Not Found');
    expect(error.statusCode).toBe(404);
    expect(error.method).toBe('GET');
    expect(error.details).toEqual({ resource: 'User' });
  });

  test('toJSON method should return correct JSON representation', () => {
    const error = new RequestError('Not Found', 404, 'GET', {
      resource: 'User',
    });
    const json = error.toJSON();
    expect(json).toEqual({
      name: 'RequestError',
      message: 'Not Found',
      statusCode: 404,
      method: 'GET',
      details: { resource: 'User' },
    });
  });

  test('toString method should return correct string representation', () => {
    const error = new RequestError('Not Found', 404, 'GET', {
      resource: 'User',
    });
    const str = error.toString();
    expect(str).toBe(
      'RequestError [GET] (Status: 404): Not Found - Details: {"resource":"User"}',
    );
  });

  test('should capture stack trace', () => {
    const error = new RequestError('Stack trace test');
    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('RequestError: Stack trace test');
  });

  test('captureStackTrace should not throw if not available', () => {
    const originalCaptureStackTrace = Error.captureStackTrace;
    Error.captureStackTrace =
      undefined as unknown as typeof Error.captureStackTrace;

    const error = new RequestError('No captureStackTrace');
    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('RequestError: No captureStackTrace');
    Error.captureStackTrace = originalCaptureStackTrace;
  });
});
